import { describe, it, expect } from "vitest";
import {
  parseProductCustomizationFields,
  parseProductCustomizationConfig,
  isCustomizationEnabled,
  buildLineItemMetadata,
  parseLineItemCustomizations,
  validateCustomizationValues,
} from "@/lib/customization";

describe("customization", () => {
  it("parses legacy single-text metadata", () => {
    const fields = parseProductCustomizationFields({
      customization: true,
      max_chars: 12,
      customization_label: "Name",
    });

    expect(fields).toHaveLength(1);
    expect(fields[0]).toMatchObject({
      id: "engraving_text",
      type: "text",
      label: "Name",
      max_length: 12,
    });
  });

  it("parses minified JSON string from Medusa Admin metadata", () => {
    const json =
      '[{"id":"engraving_text","type":"text","label":"Name","max_length":12},{"id":"logo","type":"logo","label":"Logo","allow_upload":true,"options":[{"value":"batman","label":"Batman"}]}]';

    const fields = parseProductCustomizationFields({
      customization_fields: json,
    });

    expect(fields).toHaveLength(2);
    expect(fields[0]).toMatchObject({ id: "engraving_text", type: "text" });
    expect(fields[1]).toMatchObject({ id: "logo", type: "logo" });
  });

  it("returns empty array for invalid customization_fields JSON", () => {
    expect(
      parseProductCustomizationFields({
        customization_fields: "not-valid-json",
      })
    ).toEqual([]);
  });

  it("parses multi-field metadata with logo presets and upload", () => {
    const fields = parseProductCustomizationFields({
      customization_fields: [
        {
          id: "engraving_text",
          type: "text",
          label: "Name",
          max_length: 12,
        },
        {
          id: "logo",
          type: "logo",
          label: "Logo",
          allow_upload: true,
          options: [{ value: "batman", label: "Batman" }],
        },
      ],
    });

    expect(fields).toHaveLength(2);
    expect(fields[1]).toMatchObject({
      id: "logo",
      type: "logo",
      allow_upload: true,
    });
  });

  it("builds line item metadata for text and uploaded logo", () => {
    const fields = parseProductCustomizationFields({
      customization_fields: [
        { id: "engraving_text", type: "text", label: "Name", max_length: 12 },
        {
          id: "logo",
          type: "logo",
          label: "Logo",
          allow_upload: true,
          options: [{ value: "batman", label: "Batman" }],
        },
      ],
    });

    const metadata = buildLineItemMetadata(fields, {
      engraving_text: "BHUVAN",
      logo: {
        source: "upload",
        url: "https://example.com/logo.png",
        filename: "logo.png",
      },
    });

    expect(metadata.customization).toBe("BHUVAN");
    expect(metadata.customizations).toEqual([
      {
        field_id: "engraving_text",
        type: "text",
        label: "Name",
        value: "BHUVAN",
        display: "BHUVAN",
      },
      {
        field_id: "logo",
        type: "logo",
        label: "Logo",
        source: "upload",
        value: "https://example.com/logo.png",
        filename: "logo.png",
        display: "logo.png",
        image_url: "https://example.com/logo.png",
      },
    ]);
  });

  it("reads customizations stored as JSON string on line items", () => {
    expect(
      parseLineItemCustomizations({
        customizations:
          '[{"field_id":"engraving_text","type":"text","label":"Name","value":"BHUVAN","display":"BHUVAN"}]',
      })
    ).toEqual([
      {
        field_id: "engraving_text",
        type: "text",
        label: "Name",
        value: "BHUVAN",
        display: "BHUVAN",
      },
    ]);
  });

  it("reads legacy line item metadata", () => {
    expect(
      parseLineItemCustomizations({ customization: "MYSTAND" })
    ).toEqual([
      {
        field_id: "engraving_text",
        type: "text",
        label: "Custom Text",
        value: "MYSTAND",
        display: "MYSTAND",
      },
    ]);
  });

  it("validates required fields", () => {
    const fields = parseProductCustomizationFields({
      customization_fields: [
        { id: "engraving_text", type: "text", label: "Name", required: true },
      ],
    });

    expect(
      validateCustomizationValues(fields, { engraving_text: "" })
    ).toEqual([{ fieldId: "engraving_text", message: "Name is required" }]);
  });

  it("parses object metadata with when gate", () => {
    const config = parseProductCustomizationConfig({
      customization_fields: {
        when: { option: "Edition", value: "Custom" },
        fields: [
          {
            id: "engraving_text",
            type: "text",
            label: "Name",
            max_length: 12,
            required: true,
          },
        ],
      },
    });

    expect(config.when).toEqual({ option: "Edition", value: "Custom" });
    expect(config.fields).toHaveLength(1);
  });

  it("parses when shorthand string Edition:Custom", () => {
    const config = parseProductCustomizationConfig({
      customization_fields: {
        when: "Edition:Custom",
        fields: [{ id: "engraving_text", type: "text", label: "Name" }],
      },
    });

    expect(config.when).toEqual({ option: "Edition", value: "Custom" });
  });

  it("parses gated config from JSON string in Admin metadata", () => {
    const json = JSON.stringify({
      when: { option: "Edition", value: "Custom" },
      fields: [{ id: "engraving_text", type: "text", label: "Name" }],
    });

    const config = parseProductCustomizationConfig({
      customization_fields: json,
    });

    expect(config.when?.value).toBe("Custom");
    expect(config.fields).toHaveLength(1);
  });

  it("array-only metadata has no when rule", () => {
    const config = parseProductCustomizationConfig({
      customization_fields: [{ id: "engraving_text", type: "text", label: "Name" }],
    });

    expect(config.when).toBeUndefined();
    expect(config.fields).toHaveLength(1);
  });

  it("parses config wrapped in array with single field object (common Admin mistake)", () => {
    const config = parseProductCustomizationConfig({
      customization_fields: [
        {
          when: { option: "Variant", value: "Custom" },
          fields: {
            id: "engraving_text",
            type: "text",
            label: "Name",
            max_length: 7,
            required: false,
          },
        },
      ],
    });

    expect(config.when).toEqual({ option: "Variant", value: "Custom" });
    expect(config.fields).toHaveLength(1);
    expect(config.fields[0]).toMatchObject({ id: "engraving_text", max_length: 7 });
  });

  it("parses exact Medusa Admin string for Variant/Custom product", () => {
    const json =
      '[{"when":{"option":"Variant","value":"Custom"},"fields":{"id":"engraving_text","type":"text","label":"Name","helper":"This text will be 3D printed on your product","max_length":7,"required":false}}]';

    const config = parseProductCustomizationConfig({
      customization_fields: json,
    });

    expect(config.when?.value).toBe("Custom");
    expect(config.fields[0]?.id).toBe("engraving_text");
  });

  describe("isCustomizationEnabled", () => {
    const when = { option: "Edition", value: "Custom" };

    it("returns true when no when rule", () => {
      expect(isCustomizationEnabled(undefined, { Edition: "Standard" })).toBe(
        true
      );
    });

    it("returns true when selected option matches (case insensitive)", () => {
      expect(
        isCustomizationEnabled(when, { Edition: "Custom", Color: "Teal" })
      ).toBe(true);
      expect(
        isCustomizationEnabled(when, { edition: "custom" })
      ).toBe(true);
    });

    it("returns false when selected option does not match", () => {
      expect(
        isCustomizationEnabled(when, { Edition: "Standard" })
      ).toBe(false);
    });
  });
});
