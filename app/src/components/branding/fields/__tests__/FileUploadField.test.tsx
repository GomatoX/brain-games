// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, fireEvent, waitFor } from "@testing-library/react"
import FileUploadField from "../FileUploadField"

describe("<FileUploadField />", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({ path: "uploads/abc.png" }), { status: 200 }),
    ))
    vi.stubGlobal("alert", vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders the label and 'No image' placeholder when path is null", () => {
    const { getByText } = render(
      <FileUploadField label="Logo (light)" kind="logo" path={null} onChange={() => {}} />,
    )
    expect(getByText("Logo (light)")).toBeTruthy()
    expect(getByText("No image")).toBeTruthy()
  })

  it("renders the preview img when path is set", () => {
    const { getByAltText } = render(
      <FileUploadField label="Favicon" kind="favicon" path="uploads/x.png" onChange={() => {}} />,
    )
    const img = getByAltText("Favicon") as HTMLImageElement
    expect(img.src).toContain("/api/uploads/uploads/x.png")
  })

  it("posts to /api/uploads/branding and calls onChange with the returned path", async () => {
    const handle = vi.fn()
    const { container } = render(
      <FileUploadField label="Logo" kind="logo" path={null} onChange={handle} />,
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(["x"], "logo.png", { type: "image/png" })
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => expect(handle).toHaveBeenCalledWith("uploads/abc.png"))
    const fetchMock = global.fetch as unknown as ReturnType<typeof vi.fn>
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/uploads/branding",
      expect.objectContaining({ method: "POST" }),
    )
  })

  it("calls onChange(null) when Remove is clicked", () => {
    const handle = vi.fn()
    const { getByText } = render(
      <FileUploadField label="Logo" kind="logo" path="uploads/x.png" onChange={handle} />,
    )
    fireEvent.click(getByText("Remove"))
    expect(handle).toHaveBeenCalledWith(null)
  })

  it("alerts on upload failure", async () => {
    ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "too big" }), { status: 413 }),
    )
    const handle = vi.fn()
    const { container } = render(
      <FileUploadField label="Logo" kind="logo" path={null} onChange={handle} />,
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [new File(["x"], "x.png", { type: "image/png" })] } })
    await waitFor(() => expect(global.alert).toHaveBeenCalled())
    expect(handle).not.toHaveBeenCalled()
  })
})
