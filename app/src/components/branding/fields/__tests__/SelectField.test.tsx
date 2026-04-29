// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import SelectField from "../SelectField"

describe("<SelectField />", () => {
  it("renders the label", () => {
    const { getByText } = render(
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
  })

  it("renders a combobox trigger", () => {
    const { getByRole } = render(
      <SelectField
        label="Density"
        value="compact"
        onChange={() => {}}
        options={[
          { value: "compact", label: "Compact" },
          { value: "cozy", label: "Cozy" },
        ]}
      />,
    )
    const trigger = getByRole("combobox")
    expect(trigger).toBeTruthy()
    expect(trigger.textContent).toContain("Compact")
  })

  it("accepts an onChange callback and renders without errors", () => {
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
    expect(getByRole("combobox")).toBeTruthy()
    expect(handle).not.toHaveBeenCalled()
  })

  it("shows placeholder when value is empty", () => {
    const { getByRole } = render(
      <SelectField
        label="Preset"
        value=""
        onChange={() => {}}
        placeholder="Pick a preset…"
        options={[{ value: "coral", label: "Coral" }]}
      />,
    )
    const trigger = getByRole("combobox")
    expect(trigger).toBeTruthy()
    expect(trigger.textContent).toContain("Pick a preset…")
  })
})
