const PATTERN = [".X.X.", "XXXXX", ".X.X.", "XXXXX", ".X.X."]

export const MiniCrossword = () => (
  <div className="cw-mini" aria-hidden="true">
    {PATTERN.flatMap((row, r) =>
      row.split("").map((ch, c) => (
        <div
          key={`${r}-${c}`}
          className={`c ${ch === "." ? "b" : ""} ${
            (r === 1 && c === 2) || (r === 3 && c === 2) ? "hl" : ""
          }`}
        />
      )),
    )}
  </div>
)
