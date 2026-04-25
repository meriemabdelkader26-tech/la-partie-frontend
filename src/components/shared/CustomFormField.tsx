import Image from "next/image";
import { Control } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Editor from "./Editor";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PhoneInput } from "../ui/phone-input";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  PASSWORD = "password",
  EDITOR = "editor",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  labelChildren?: React.ReactNode;
  description?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  selectContentClassName?: string;
  onChange?: (value: any) => void;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  const [showPassword, setShowPassword] = useState<boolean>(true);

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="relative group">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-50 group-focus-within:opacity-100 transition-opacity"
            />
          )}
          {props.icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              {props.icon}
            </div>
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              disabled={props.disabled}
              className={
                cn(
                  "h-12 bg-transparent border-2 border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-0 transition-all rounded-xl",
                  (props.iconSrc || props.icon) && "pl-12",
                  props.inputClassName
                )
              }
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PASSWORD:
      return (
        <div className="relative">
          <FormControl>
            <Input
              type={!showPassword ? "text" : "password"}
              placeholder={props.placeholder}
              {...field}
              disabled={props.disabled}
              className={cn(
                "h-12 bg-transparent border-2 border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-0 transition-colors rounded-xl pr-12",
                props.inputClassName
              )}
            />
          </FormControl>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            disabled={props.disabled}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            disabled={props.disabled}
            className="min-h-32 bg-white border-2 border-black/10 text-black placeholder:text-gray-400 focus:border-black focus:ring-0 transition-colors rounded-xl"
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="TN"
            placeholder={props.placeholder}
            international
            disabled={props.disabled}
            value={field.value}
            onChange={field.onChange}
            className={cn(
              "h-12 bg-transparent border-2 border-input text-foreground placeholder:text-muted-foreground focus-within:border-ring focus-within:ring-0 transition-all rounded-xl overflow-hidden",
              props.inputClassName
            )}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={props.disabled}
            />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={props.name}
                className="cursor-pointer text-sm font-medium text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 leading-none"
              >
                {props.label}
              </label>
              {props.description && (
                <p className="text-[12px] text-gray-500 font-medium leading-normal">
                  {props.description}
                </p>
              )}
            </div>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 px-4 bg-white border-2 border-black/10 text-black hover:bg-gray-50 hover:text-black hover:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl",
                  !field.value && "text-gray-400"
                )}
                disabled={props.disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                {field.value ? (
                  format(field.value, props.dateFormat || "PPP")
                ) : (
                  <span>{props.placeholder || "Pick a date"}</span>
                )}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white border-2 border-black/10"
            align="start"
          >
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={props.disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    case FormFieldType.NATIVE_SELECT:
      return (
        <FormControl>
          <div className="relative">
            <select
              {...field}
              disabled={props.disabled}
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e);
                if (props.onChange) props.onChange(e.target.value);
              }}
              className={cn(
                "h-12 bg-white border-2 border-black/10 rounded-xl w-full px-4 appearance-none focus:border-black focus:ring-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                !field.value ? "text-gray-500" : "text-black",
                props.selectClassName
              )}
            >
              <option value="" disabled hidden>
                {props.placeholder}
              </option>
              {props.children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={(val) => {
              field.onChange(val);
              if (props.onChange) props.onChange(val);
            }}
            value={field.value}
            defaultValue={field.value}
            disabled={props.disabled}
          >
            <FormControl className={cn("h-12 bg-white border-2 border-black/10 text-black placeholder:text-gray-400 rounded-xl w-full", props.selectClassName)}>
              <SelectTrigger className="h-12 [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={cn("bg-white border-2 border-black/10 text-black rounded-xl", props.selectContentClassName)}>
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.EDITOR:
      return (
        <FormControl>
          <Editor value={field.value || ""} onChange={field.onChange} />
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label, labelChildren } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel
              className={cn(
                props.labelClassName || "text-sm font-semibold text-black mb-2",
                "flex items-center justify-between w-full"
              )}
            >
              <span>{label}</span>
              {labelChildren && <div>{labelChildren}</div>}
            </FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage className="text-red-500 font-medium text-sm mt-1" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
