// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import HelpHint from "../HelpHint"

describe("<HelpHint />", () => {
  it("renders an info marker with the given text as title and aria-label", () => {
    const { getByLabelText } = render(<HelpHint text="Tighter or looser spacing" />)
    const el = getByLabelText("Tighter or looser spacing")
    expect(el.getAttribute("title")).toBe("Tighter or looser spacing")
    // Visible character: ⓘ
    expect(el.textContent).toBe("ⓘ")
  })

  it("uses role='img' so screen readers announce the marker as a single token", () => {
    const { getByRole } = render(<HelpHint text="Help text" />)
    expect(getByRole("img", { name: "Help text" })).toBeTruthy()
  })
})
