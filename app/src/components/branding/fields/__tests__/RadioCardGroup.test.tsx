// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest"
import { render, fireEvent } from "@testing-library/react"
import RadioCardGroup from "../RadioCardGroup"

describe("<RadioCardGroup />", () => {
  it("renders the label and one radio per option", () => {
    const { getByText, getAllByRole } = render(
      <RadioCardGroup
        label="Button variant"
        value="solid"
        onChange={() => {}}
        options={[
          { value: "solid", label: "Solid", preview: <span>S</span> },
          { value: "outline", label: "Outline", preview: <span>O</span> },
        ]}
      />,
    )
    expect(getByText("Button variant")).toBeTruthy()
    expect(getAllByRole("radio")).toHaveLength(2)
  })

  it("marks the selected option with aria-checked", () => {
    const { getAllByRole } = render(
      <RadioCardGroup
        label="Button variant"
        value="outline"
        onChange={() => {}}
        options={[
          { value: "solid", label: "Solid", preview: <span /> },
          { value: "outline", label: "Outline", preview: <span /> },
        ]}
      />,
    )
    const radios = getAllByRole("radio")
    expect(radios[0].getAttribute("aria-checked")).toBe("false")
    expect(radios[1].getAttribute("aria-checked")).toBe("true")
  })

  it("calls onChange with the new value when a card is clicked", () => {
    const handle = vi.fn()
    const { getAllByRole } = render(
      <RadioCardGroup
        label="Button variant"
        value="solid"
        onChange={handle}
        options={[
          { value: "solid", label: "Solid", preview: <span /> },
          { value: "outline", label: "Outline", preview: <span /> },
        ]}
      />,
    )
    fireEvent.click(getAllByRole("radio")[1])
    expect(handle).toHaveBeenCalledWith("outline")
  })

  it("supports keyboard activation via Enter and Space", () => {
    const handle = vi.fn()
    const { getAllByRole } = render(
      <RadioCardGroup
        label="Button variant"
        value="solid"
        onChange={handle}
        options={[
          { value: "solid", label: "Solid", preview: <span /> },
          { value: "outline", label: "Outline", preview: <span /> },
        ]}
      />,
    )
    fireEvent.keyDown(getAllByRole("radio")[1], { key: " " })
    fireEvent.keyDown(getAllByRole("radio")[1], { key: "Enter" })
    expect(handle).toHaveBeenCalledTimes(2)
    expect(handle).toHaveBeenLastCalledWith("outline")
  })
})
