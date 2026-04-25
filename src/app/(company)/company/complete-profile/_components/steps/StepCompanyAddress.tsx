import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyAddressSchema, CompanyAddressType } from "../schema";
import { ProfileCompanyFormData } from "../types";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { useEffect, useState } from "react";
import tunisiaCities from "../../../../../../../public/tunisia-cities.json";
import SubmitButton from "@/components/shared/SubmitButton";
import { MapPin, Navigation, Mailbox, Globe2, Loader2, Map as MapIcon } from "lucide-react";
import MapPreview from "@/components/shared/MapPreview";

interface Props {
  formData: ProfileCompanyFormData;
  onUpdate: (updates: Partial<ProfileCompanyFormData>) => void;
  onNext: () => void;
}

const StepCompanyAddress = (props: Props) => {
  const { formData, onUpdate, onNext } = props;
  const [availableZones, setAvailableZones] = useState<
    Array<{
      city: string;
      zone: string;
    }>
  >([]);

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [skipNextGeocode, setSkipNextGeocode] = useState(false);
  const suggestionRef = useState<HTMLDivElement | null>(null)[0]; // Actually I'll just use the class approach for now to avoid complexity with refs in this context

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showSuggestions && !target.closest('.address-autocomplete-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  const form = useForm<CompanyAddressType>({
    resolver: zodResolver(CompanyAddressSchema),
    defaultValues: {
      address: formData.address || "",
      city: formData.city || "",
      state: formData.state || "",
      postalCode: formData.postalCode || "",
      country: formData.country || "Tunisia",
    },
  });

  const selectedCity = form.watch("city");
  const selectedZone = form.watch("state");
  const streetAddress = form.watch("address");

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!streetAddress || streetAddress.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      const query = `${streetAddress}${selectedCity ? ", " + selectedCity : ""}, Tunisia`;
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
        if (data.length > 0) setShowSuggestions(true);
      } catch (error) {
        console.error("Autocomplete failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timer);
  }, [streetAddress, selectedCity]);

  useEffect(() => {
    const geocode = async () => {
      if (skipNextGeocode) {
        setSkipNextGeocode(false);
        return;
      }
      if (!selectedCity) {
        setCoords(null);
        return;
      }

      setIsGeocoding(true);
      // Construct a search query for Tunisia
      const query = `${streetAddress ? streetAddress + ", " : ""}${
        selectedZone ? selectedZone + ", " : ""
      }${selectedCity}, Tunisia`;
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          });
        } else if (selectedCity) {
          // Fallback to just city if specific address fails
          const cityResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              selectedCity + ", Tunisia"
            )}&limit=1`
          );
          const cityData = await cityResponse.json();
          if (cityData && cityData.length > 0) {
            setCoords({
              lat: parseFloat(cityData[0].lat),
              lon: parseFloat(cityData[0].lon),
            });
          }
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
      } finally {
        setIsGeocoding(false);
      }
    };

    const timer = setTimeout(geocode, 1000);
    return () => clearTimeout(timer);
  }, [selectedCity, selectedZone, streetAddress]);

  useEffect(() => {
    if (
      selectedCity &&
      tunisiaCities[selectedCity as keyof typeof tunisiaCities]
    ) {
      const zones = tunisiaCities[selectedCity as keyof typeof tunisiaCities];
      setAvailableZones(zones);
      if (formData.city !== selectedCity) {
        form.setValue("state", "");
      }
    } else {
      setAvailableZones([]);
    }
  }, [selectedCity, form, formData.city]);

  const onSubmit = (data: CompanyAddressType) => {
    onUpdate({
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
    });
    onNext();
  };

  const cities = Object.keys(tunisiaCities);

  const handleSelectSuggestion = (suggestion: any) => {
    const addr = suggestion.address;
    
    // Attempt to extract the street address
    const street = addr.road || addr.pedestrian || addr.suburb || suggestion.display_name.split(',')[0];
    
    form.setValue("address", street);
    
    // Find city in our tunisiaCities list if possible
    const cityMatch = cities.find(c => 
      suggestion.display_name.toLowerCase().includes(c.toLowerCase()) ||
      (addr.city && addr.city.toLowerCase() === c.toLowerCase()) ||
      (addr.town && addr.town.toLowerCase() === c.toLowerCase())
    );

    if (cityMatch) {
      form.setValue("city", cityMatch);
      
      // Try to find zone/state
      const zones = tunisiaCities[cityMatch as keyof typeof tunisiaCities];
      const zoneMatch = zones.find(z => 
        suggestion.display_name.toLowerCase().includes(z.zone.toLowerCase()) ||
        (addr.suburb && addr.suburb.toLowerCase() === z.zone.toLowerCase()) ||
        (addr.neighbourhood && addr.neighbourhood.toLowerCase() === z.zone.toLowerCase())
      );
      
      if (zoneMatch) {
        form.setValue("state", zoneMatch.zone);
      }
    }

    if (addr.postcode) {
      form.setValue("postalCode", addr.postcode);
    }

    setSkipNextGeocode(true);
    setCoords({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    
    setShowSuggestions(false);
  };

  const handleMapClick = async (lat: number, lon: number) => {
    setIsGeocoding(true);
    setCoords({ lat, lon });
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        
        // Extract street
        const street = addr.road || addr.pedestrian || addr.suburb || data.display_name.split(',')[0];
        form.setValue("address", street);
        
        // Match city
        const cityMatch = cities.find(c => 
          data.display_name.toLowerCase().includes(c.toLowerCase()) ||
          (addr.city && addr.city.toLowerCase() === c.toLowerCase()) ||
          (addr.town && addr.town.toLowerCase() === c.toLowerCase())
        );

        if (cityMatch) {
          form.setValue("city", cityMatch);
          
          // Match zone
          const zones = tunisiaCities[cityMatch as keyof typeof tunisiaCities];
          const zoneMatch = zones.find(z => 
            data.display_name.toLowerCase().includes(z.zone.toLowerCase()) ||
            (addr.suburb && addr.suburb.toLowerCase() === z.zone.toLowerCase()) ||
            (addr.neighbourhood && addr.neighbourhood.toLowerCase() === z.zone.toLowerCase())
          );
          
          if (zoneMatch) {
            form.setValue("state", zoneMatch.zone);
          }
        }

        if (addr.postcode) {
          form.setValue("postalCode", addr.postcode);
        }
        
        setSkipNextGeocode(true);
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Get the placeholder text based on whether a city is selected
  const getZonePlaceholder = () => {
    if (!selectedCity) {
      return "First select a city";
    }
    return availableZones.length > 0 ? "Select your zone" : "Loading zones...";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fadeIn">
        <div className="space-y-6">
          <div className="relative address-autocomplete-container">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Street Address"
              placeholder="Start typing your street name..."
              icon={<MapPin className="w-4 h-4 text-gray-400" />}
              className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
              onChange={() => setShowSuggestions(true)}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Suggestions</span>
                </div>
                <div className="max-h-[240px] overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-black group-hover:text-white transition-colors mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-black truncate">
                            {s.display_name.split(',')[0]}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {s.display_name.split(',').slice(1).join(',').trim()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-2 bg-gray-50/50 flex justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            
            {isSearching && (
              <div className="absolute right-4 top-[38px] z-10">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="city"
              label="City"
              placeholder="Select your city"
              icon={<Navigation className="w-4 h-4 text-gray-400" />}
              selectClassName="bg-gray-50/50 border-gray-100 rounded-xl h-12"
            >
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="state"
              label="Zone/Area"
              placeholder={getZonePlaceholder()}
              disabled={!selectedCity || availableZones.length === 0}
              icon={<Navigation className="w-4 h-4 text-gray-400" />}
              selectClassName="bg-gray-50/50 border-gray-100 rounded-xl h-12"
            >
              {availableZones.map((zone) => (
                <SelectItem key={zone.zone} value={zone.zone}>
                  {zone.zone}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="postalCode"
              label="Postal Code"
              placeholder="e.g. 1000"
              icon={<Mailbox className="w-4 h-4 text-gray-400" />}
              className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="country"
              label="Country"
              disabled={true}
              placeholder="Tunisia"
              icon={<Globe2 className="w-4 h-4 text-gray-400" />}
              className="bg-gray-100 border-gray-100 rounded-xl h-12 text-gray-500"
            />
          </div>

          {/* Map Preview Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-black text-white">
                  <MapIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">Location Preview</h4>
                  <p className="text-xs text-gray-500">Verify your company location on the map</p>
                </div>
              </div>
              {isGeocoding && (
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Updating...
                </div>
              )}
            </div>
            
            <div className="relative h-[300px] w-full group">
              {coords ? (
                <MapPreview lat={coords.lat} lon={coords.lon} onLocationSelect={handleMapClick} />
              ) : (
                <div className="h-full w-full bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group-hover:bg-gray-50 group-hover:border-gray-200">
                  <div className="p-4 rounded-full bg-white shadow-sm border border-gray-50">
                    <MapPin className="w-8 h-8 text-gray-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-400">No Location Selected</p>
                    <p className="text-xs text-gray-300">Enter an address to see the map preview</p>
                  </div>
                </div>
              )}
              
              {/* Glass overlay for aesthetic */}
              <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-black uppercase tracking-wider">Live Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 animate-fadeInUp delay-200">
          <SubmitButton 
            isLoading={false}
            className="w-full bg-black hover:bg-gray-900 text-white font-black h-14 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Continue
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default StepCompanyAddress;
