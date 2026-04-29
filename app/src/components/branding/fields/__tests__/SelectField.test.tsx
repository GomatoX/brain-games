// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from "vitest"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SelectField from "../SelectField"

beforeAll(() => {
  Element.prototype.hasPointerCapture = vi.fn()
  Element.prototype.scrollIntoView = vi.fn()
})

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

  it("calls onChange with the new value when an option is picked", async () => {
    const handle = vi.fn()
    const user = userEvent.setup()
    const { getByRole, findByRole } = render(
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
    await user.click(getByRole("combobox"))
    const cozyOption = await findByRole("option", { name: "Cozy" })
    await user.click(cozyOption)
    expect(handle).toHaveBeenCalledWith("cozy")
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
