import SwiftUI

/**
 How much stock there is, as a glyph and a word.

 Values come from `CCStockQuantityStatusStyle.resolve`, generated from
 `stock-quantity-status.recipe.ts`: the status ink. The glyph is the web's —
 a capsule track in `surface-neutral` with the filled part in the status colour,
 drawn from the same SVG path data so the three platforms share one shape.
 */
public struct CCStockQuantityStatus: View {
    private let quantity: CCStockQuantityStatusQuantity

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand

    public init(quantity: CCStockQuantityStatusQuantity = .sufficient) {
        self.quantity = quantity
    }

    private var label: String {
        switch quantity {
        case .sufficient: return CCStrings.stockSufficient
        case .normal: return CCStrings.stockNormal
        case .insufficient: return CCStrings.stockInsufficient
        }
    }

    public var body: some View {
        let style = CCStockQuantityStatusStyle.resolve(quantity: quantity, scheme: colorScheme, brand: brand)
        let ink = style.color ?? CocsoTokens.Color.textPrimary(colorScheme, brand: brand)
        HStack(spacing: CocsoTokens.Spacing.s3) {
            ZStack {
                ForEach(Array(StockGlyph.track.enumerated()), id: \.offset) { _, d in
                    SVGPath(d).fill(CocsoTokens.Color.surfaceNeutral(colorScheme, brand: brand), style: FillStyle(eoFill: true))
                }
                SVGPath(StockGlyph.fill(quantity)).fill(ink)
            }
            .frame(width: 16, height: 16)
            .accessibilityHidden(true)
            CCTypography(label, type: .body, size: .small, color: ink)
        }
        .accessibilityElement(children: .combine)
    }
}

/// The web's `<path d>` data, in a 16-unit box.
enum StockGlyph {
    static let track = [
        "M7.06494 13.0754C4.26764 13.0754 1.99999 10.8199 2 8.03765C2.00001 5.25543 4.26766 3 7.06494 3L9.48051 3V6.10011L7.06494 6.10011C5.98906 6.10011 5.11689 6.96758 5.11689 8.03767C5.11688 9.10776 5.98906 9.97524 7.06494 9.97524L9.48051 9.97524V13.0754H7.06494Z",
        "M9.48051 9.97524L9.48051 6.10011L12.0519 6.10026C13.1278 6.10026 14 6.96774 14 8.03783C14 9.10792 13.1278 9.9754 12.0519 9.9754L9.48051 9.97524Z",
    ]

    static func fill(_ quantity: CCStockQuantityStatusQuantity) -> String {
        switch quantity {
        case .sufficient:
            return "M9.48047 6.10059H7.06543C5.98955 6.10059 5.11719 6.968 5.11719 8.03809C5.11741 9.10782 5.98893 9.97532 7.06445 9.97559H9.48047V13.0752H7.06445C4.35911 13.0749 2.14983 10.9652 2.00781 8.30957V7.76465C2.15041 5.10939 4.36025 3 7.06543 3H9.48047V6.10059ZM12.0518 6.10059C13.1276 6.10059 14 6.968 14 8.03809C13.9999 9.10806 13.1276 9.97559 12.0518 9.97559H9.48047V6.10059H12.0518Z"
        case .normal:
            return "M9.48145 6.0752V6.10059H7.06641C5.99053 6.10059 5.11817 6.968 5.11816 8.03809C5.11839 9.10782 5.98991 9.97532 7.06543 9.97559H9.48145V13.0752H7.06543C4.35577 13.0749 2.14345 10.9585 2.00781 8.29688V7.77832C2.03849 7.17662 2.17568 6.60303 2.40039 6.0752H9.48145ZM12.0527 6.10059C13.1286 6.10059 14.001 6.968 14.001 8.03809C14.0008 9.10806 13.1285 9.97559 12.0527 9.97559H9.48145V6.10059H12.0527Z"
        case .insufficient:
            return "M7.04688 9.97461C7.05273 9.97466 7.05859 9.97558 7.06445 9.97559H9.48047V13.0752H7.06445C4.95754 13.075 3.15182 11.7952 2.38867 9.97461H7.04688ZM12.0713 9.97461C12.0648 9.97467 12.0582 9.97559 12.0518 9.97559H9.48047V9.97461H12.0713Z"
        }
    }
}

/// An SVG path (absolute M, L, H, V, C, Z — what the glyphs use) as a Shape
/// scaled from its 16-unit box to the rect it is given.
struct SVGPath: Shape {
    let d: String

    init(_ d: String) { self.d = d }

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let scale = rect.width / 16
        var current = CGPoint.zero
        var numbers: [CGFloat] = []
        var command: Character = "M"

        func point(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
            CGPoint(x: rect.minX + x * scale, y: rect.minY + y * scale)
        }
        func flush() {
            switch command {
            case "M" where numbers.count >= 2:
                current = CGPoint(x: numbers[0], y: numbers[1]); path.move(to: point(current.x, current.y))
            case "L" where numbers.count >= 2:
                current = CGPoint(x: numbers[0], y: numbers[1]); path.addLine(to: point(current.x, current.y))
            case "H" where numbers.count >= 1:
                current.x = numbers[0]; path.addLine(to: point(current.x, current.y))
            case "V" where numbers.count >= 1:
                current.y = numbers[0]; path.addLine(to: point(current.x, current.y))
            case "C" where numbers.count >= 6:
                path.addCurve(
                    to: point(numbers[4], numbers[5]),
                    control1: point(numbers[0], numbers[1]),
                    control2: point(numbers[2], numbers[3])
                )
                current = CGPoint(x: numbers[4], y: numbers[5])
            case "Z":
                path.closeSubpath()
            default:
                break
            }
            numbers.removeAll()
        }

        var token = ""
        func endToken() {
            if let value = Double(token) { numbers.append(CGFloat(value)) }
            token = ""
        }
        for ch in d {
            if ch.isLetter {
                endToken(); flush(); command = ch
                if ch == "Z" { flush() }
            } else if ch == " " || ch == "," {
                endToken()
            } else if ch == "-" && !token.isEmpty {
                endToken(); token = "-"
            } else {
                token.append(ch)
            }
        }
        endToken(); flush()
        return path
    }
}
