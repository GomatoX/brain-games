// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, fireEvent, waitFor } from "@testing-library/react"
import FileUploadField from "../FileUploadField"

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

describe("<FileUploadField />", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({ path: "uploads/abc.png" }), { status: 200 }),
    ))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it("renders the label and dropzone hint when path is null", () => {
    const { getByText } = render(
      <FileUploadField label="Logo (light)" kind="logo" path={null} onChange={() => {}} />,
    )
    expect(getByText("Logo (light)")).toBeTruthy()
    expect(getByText("Drop an image here, or click to choose")).toBeTruthy()
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

  it("shows a toast error on upload failure", async () => {
    ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "too big" }), { status: 413 }),
    )
    const handle = vi.fn()
    const { container } = render(
      <FileUploadField label="Logo" kind="logo" path={null} onChange={handle} />,
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [new File(["x"], "x.png", { type: "image/png" })] } })
    const { toast } = await import("sonner")
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Upload failed")))
    expect(handle).not.toHaveBeenCalled()
  })
})

describe("<FileUploadField /> drag and drop", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

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
    const file = new File(["hello"], "logo.png", { type: "image/png" })

    fireEvent.drop(zone, {
      dataTransfer: {
        types: ["Files"],
        files: [file],
        items: [
          {
            kind: "file",
            type: "image/png",
            getAsFile: () => file,
          },
        ],
      },
    })

    await waitFor(() => expect(onChange).toHaveBeenCalledWith("uploads/abc.png"))
  })

  it("applies an active drag style while a file is hovering over the dropzone", async () => {
    const { getByTestId } = render(
      <FileUploadField label="Logo" kind="logo" path={null} onChange={() => {}} />,
    )
    const zone = getByTestId("file-upload-dropzone")

    // Provide dataTransfer.types so react-dropzone's isEvtWithFiles() returns true,
    // and files/items arrays so file-selector does not crash reading their length.
    const dt = { types: ["Files"], items: [], files: [] }
    fireEvent.dragEnter(zone, { dataTransfer: dt })
    await waitFor(() => expect(zone.className).toContain("border-primary"))

    fireEvent.dragLeave(zone, { dataTransfer: dt })
    await waitFor(() => expect(zone.className).not.toContain("border-primary"))
  })

  it("shows an 'Uploading…' indicator while the request is in flight", async () => {
    let resolveFetch: (r: Response) => void = () => {}
    const fetchMock = vi.fn(() => new Promise<Response>((r) => { resolveFetch = r }))
    vi.stubGlobal("fetch", fetchMock)

    const { container, queryByText } = render(
      <FileUploadField label="Logo" kind="logo" path={null} onChange={() => {}} />,
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(["x"], "logo.png", { type: "image/png" })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => expect(queryByText("Uploading…")).toBeTruthy())

    resolveFetch(new Response(JSON.stringify({ path: "uploads/x.png" }), { status: 200 }))
    await waitFor(() => expect(queryByText("Uploading…")).toBeNull())
  })
})
