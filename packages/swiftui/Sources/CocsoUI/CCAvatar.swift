import SwiftUI

/// An identity mark: an image, or initials when there is none.
public struct CCAvatar: View {
    private let initials: String
    private let image: Image?
    private let size: CCAvatarSize
    private let shape: CCAvatarShape
    private let label: String

    @Environment(\.colorScheme) private var colorScheme

    public init(
        initials: String,
        label: String,
        image: Image? = nil,
        size: CCAvatarSize = .md,
        shape: CCAvatarShape = .circle
    ) {
        self.initials = initials
        self.label = label
        self.image = image
        self.size = size
        self.shape = shape
    }

    public var body: some View {
        let style = CCAvatarStyle.resolve(size: size, shape: shape, scheme: colorScheme)
        let side = style.width ?? 32
        Group {
            if let image {
                image.resizable().scaledToFill()
            } else {
                Text(initials)
                    .font(.system(size: style.fontSize ?? 12, weight: style.fontWeight ?? .semibold))
                    .foregroundStyle(style.fontColor ?? CocsoTokens.Color.textPrimary(colorScheme))
            }
        }
        .frame(width: side, height: style.height ?? side)
        .background(style.bgColor ?? CocsoTokens.Color.surfaceNeutral(colorScheme))
        .clipShape(
            shape == .circle
                ? AnyShape(Circle())
                : AnyShape(RoundedRectangle(cornerRadius: style.borderRadius ?? 0))
        )
        // The image carries no meaning the label does not; naming the element
        // once keeps a screen reader from announcing an unlabelled image.
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(label)
    }
}
