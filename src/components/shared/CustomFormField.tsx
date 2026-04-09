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
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  labelChildren?: React.ReactNode;
  inputClassName?: string;
  labelClassName?: string;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  const [showPassword, setShowPassword] = useState<boolean>(true);

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div
          className={
            props.iconSrc
              ? "flex rounded-md border border-gray-100 bg-gray-200"
              : ""
          }
        >
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              disabled={props.disabled}
              className={
                props.inputClassName ||
                "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
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
              className={
                props.inputClassName ||
                "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 pr-10"
              }
            />
          </FormControl>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            disabled={props.disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
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
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 !important"
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
            className={
              props.inputClassName ||
              "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 rounded-md"
            }
            value={field.value}
            onChange={field.onChange}
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
            <label
              htmlFor={props.name}
              className="cursor-pointer text-sm font-medium text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:leading-none"
            >
              {props.label}
            </label>
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
                  "w-full justify-start text-left font-normal h-10 px-3 bg-slate-700 border-slate-600 text-white hover:bg-slate-700 hover:text-white focus-visible:ring-0 focus-visible:ring-offset-0",
                  !field.value && "text-slate-500"
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
            className="w-auto p-0 bg-slate-700 border-slate-600"
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
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={props.disabled}
          >
            <FormControl className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 w-full">
              <SelectTrigger>
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500">
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
              className={
                props.labelClassName ||
                "block text-sm font-medium text-white mb-2"
              }
            >
              {label}
              <div className="flex flex-1 justify-end">
                {labelChildren && <span className="ml-2">{labelChildren}</span>}
              </div>
            </FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
