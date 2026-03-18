import type { Metadata } from "next"

type ShareData = {
  t?: number
  r?: string
  img?: string
  title?: string
  desc?: string
}

const decodeShareData = (data: string | null): ShareData | null => {
  if (!data) return null
  try {
    return JSON.parse(decodeURIComponent(Buffer.from(data, "base64").toString("utf-8")))
  } catch {
    return null
  }
}

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>
}): Promise<Metadata> => {
  const params = await searchParams
  const shareData = decodeShareData(params.data ?? null)

  const title = shareData?.title || "Game Result"
  const description = shareData?.desc || "Check out this game result!"
  const image = shareData?.img || undefined

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      ...(image
        ? {
            images: [
              {
                url: image,
                width: 1320,
                height: 400,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

const SharePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>
}) => {
  const params = await searchParams
  const shareData = decodeShareData(params.data ?? null)
  const redirectUrl = shareData?.r || "/"

  return (
    <>
      {/* Redirect for browsers — 1s delay lets crawlers parse head first */}
      <meta httpEquiv="refresh" content={`1;url=${redirectUrl}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(redirectUrl)})`,
        }}
      />
    </>
  )
}

export default SharePage
