export type CustomizationFieldType = "text" | "select" | "logo";

/** Gate customization UI to a specific Medusa option value (variant pricing). */
export interface CustomizationWhen {
  option: string;
  value: string;
}

export interface ProductCustomizationConfig {
  fields: CustomizationFieldDef[];
  when?: CustomizationWhen;
}

export interface SelectOption {
  value: string;
  label: string;
  image_url?: string;
}

export interface TextFieldDef {
  id: string;
  type: "text";
  label: string;
  helper?: string;
  required?: boolean;
  max_length?: number;
  placeholder?: string;
}

export interface SelectFieldDef {
  id: string;
  type: "select";
  label: string;
  helper?: string;
  required?: boolean;
  options: SelectOption[];
}

export interface LogoFieldDef {
  id: string;
  type: "logo";
  label: string;
  helper?: string;
  required?: boolean;
  options?: SelectOption[];
  allow_upload?: boolean;
  accept?: string[];
  max_size_mb?: number;
}

export type CustomizationFieldDef = TextFieldDef | SelectFieldDef | LogoFieldDef;

export interface PresetLogoValue {
  source: "preset";
  value: string;
  display: string;
  image_url?: string;
}

export interface UploadLogoValue {
  source: "upload";
  url: string;
  filename: string;
  file_id?: string;
}

export type LogoFieldValue = PresetLogoValue | UploadLogoValue;

export type CustomizationFormValues = Record<
  string,
  string | LogoFieldValue | undefined
>;

export interface LineItemCustomization {
  field_id: string;
  type: CustomizationFieldType;
  label: string;
  value: string;
  display?: string;
  source?: "preset" | "upload";
  filename?: string;
  image_url?: string;
}

export interface LineItemCustomizationMetadata {
  customizations?: LineItemCustomization[];
  customization?: string;
}
