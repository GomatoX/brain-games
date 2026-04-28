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

  it("renders the label and dropzone hint when path is null", () => {
    const { getByText } = render(
      <FileUploadField label="Logo (light)" kind="logo" path={null} onChange={() => {}} />,
    )
    expect(getByText("Logo (light)")).toBeTruthy()
    expect(getByText("Drop an image here, or")).toBeTruthy()
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

describe("<FileUploadField /> drag and drop", () => {
  it("calls onChange when a file is dropped onto the dropzone", async () => {
    const onChange = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ path: "uploads/abc.png" }), { status: 200 }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { getByTestId } = render(
      <FileUploadField label="Logo" kind="logo" path={null} onChange={onChange} />,
    )
    const zone = getByTestId("file-upload-dropzone")
    const file = new File(["x"], "logo.png", { type: "image/png" })

    fireEvent.drop(zone, { dataTransfer: { files: [file] } })

    await new Promise((r) => setTimeout(r, 0))
    expect(fetchMock).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith("uploads/abc.png")

    vi.unstubAllGlobals()
  })

  it("applies a 'dragging' style while a file is hovering over the dropzone", () => {
    const { getByTestId } = render(
      <FileUploadField label="Logo" kind="logo" path={null} onChange={() => {}} />,
    )
    const zone = getByTestId("file-upload-dropzone")
    fireEvent.dragEnter(zone)
    expect(zone.className).toContain("border-blue")
    fireEvent.dragLeave(zone)
    expect(zone.className).not.toContain("border-blue")
  })

  it("shows an 'Uploading…' indicator while the request is in flight", async () => {
    let resolveFetch: (r: Response) => void = () => {}
    const fetchMock = vi.fn(() => new Promise<Response>((r) => { resolveFetch = r }))
    vi.stubGlobal("fetch", fetchMock)

    const { getByTestId, queryByText } = render(
      <FileUploadField label="Logo" kind="logo" path={null} onChange={() => {}} />,
    )
    const zone = getByTestId("file-upload-dropzone")
    const file = new File(["x"], "logo.png", { type: "image/png" })
    fireEvent.drop(zone, { dataTransfer: { files: [file] } })

    await new Promise((r) => setTimeout(r, 0))
    expect(queryByText("Uploading…")).toBeTruthy()

    resolveFetch(new Response(JSON.stringify({ path: "uploads/x.png" }), { status: 200 }))
    await new Promise((r) => setTimeout(r, 0))
    await new Promise((r) => setTimeout(r, 0))
    expect(queryByText("Uploading…")).toBeNull()

    vi.unstubAllGlobals()
  })
})
