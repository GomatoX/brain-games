// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest"
import { render, fireEvent } from "@testing-library/react"
import SelectField from "../SelectField"

describe("<SelectField />", () => {
  it("renders the label and the option list", () => {
    const { getByText, getByRole } = render(
      <SelectField
        label="Density"
        value="cozy"
        onChange={() => {}}
        options={[
          { value: "compact", label: "Compact" },
          { value: "cozy", label: "Cozy" },
        ]}
      />,
    )
    expect(getByText("Density")).toBeTruthy()
    const select = getByRole("combobox") as HTMLSelectElement
    expect(select.value).toBe("cozy")
    expect(select.options).toHaveLength(2)
  })

  it("calls onChange with the new string value when an option is picked", () => {
    const handle = vi.fn()
    const { getByRole } = render(
      <SelectField
        label="Density"
        value="compact"
        onChange={handle}
        options={[
          { value: "compact", label: "Compact" },
          { value: "cozy", label: "Cozy" },
        ]}
      />,
    )
    fireEvent.change(getByRole("combobox"), { target: { value: "cozy" } })
    expect(handle).toHaveBeenCalledWith("cozy")
  })

  it("supports a placeholder option that is disabled when value is empty", () => {
    const { getByRole } = render(
      <SelectField
        label="Preset"
        value=""
        onChange={() => {}}
        placeholder="Pick a preset…"
        options={[{ value: "coral", label: "Coral" }]}
      />,
    )
    const select = getByRole("combobox") as HTMLSelectElement
    expect(select.options[0].text).toBe("Pick a preset…")
    expect(select.options[0].disabled).toBe(true)
  })
})
