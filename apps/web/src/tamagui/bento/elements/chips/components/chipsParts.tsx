// Bento Chip — runtime v2
import React from 'react'
import { getFontSized } from '@tamagui/get-font-sized'
import type { ColorTokens, FontSizeTokens, SizeTokens } from 'tamagui'
import {
  createStyledContext,
  getFontSize,
  styled,
  Text,
  useGetThemedIcon,
  View,
  withStaticProperties,
} from 'tamagui'

const ChipContext = createStyledContext({
  size: '$true' as SizeTokens,
})

const CHIP_NAME = 'ChipName'

const ChipImpl = styled(View, {
  name: CHIP_NAME,
  flexDirection: 'row',
  context: ChipContext,
  variants: {
    rounded: {
      true: {
        rounded: 1000_000_000,
      },
    },
    unstyled: {
      false: {
        rounded: 5,
        px: '$3',
        bg: '$color6',
        justify: 'center',
        items: 'center',
        hoverStyle: {
          bg: '$color7',
        },
      },
    },
    size: {
      '...size': (val: SizeTokens, allTokens: { tokens: { space: Record<string, { val: number }> } }) => {
        const { tokens } = allTokens
        return {
          px: tokens.space[val as string]?.val,
          py: (tokens.space[val as string]?.val ?? 0) * 0.2,
        }
      },
    },
    pressable: {
      true: {
        focusable: true,
        role: 'button',
        focusVisibleStyle: {
          outlineColor: '$outlineColor',
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      },
    },
  } as const,
  defaultVariants: {
    unstyled: false,
  },
})

const CHIP_TEXT_NAME = 'ChipText'

const ChipText = styled(Text, {
  name: CHIP_TEXT_NAME,
  context: ChipContext,
  variants: {
    unstyled: {
      false: {
        fontFamily: '$body',
        color: '$color',
      },
    },
    size: {
      '...fontSize': getFontSized as never,
    },
  } as const,
  defaultVariants: {
    unstyled: false,
  },
})

type ChipIconProps = {
  color?: ColorTokens | string
  scaleIcon?: number
  size?: SizeTokens
  children: React.ReactNode
}

const CHIP_ICON = 'ChipIcon'

const ChipIconFrame = styled(View, {
  name: CHIP_ICON,
  context: ChipContext,
  variants: {
    size: {
      '...size': (val: SizeTokens, { tokens }: { tokens: { space: Record<string, { val: number }> } }) => {
        if (typeof val === 'number') {
          return {
            px: val * 0.25,
            py: val * 0.25,
          }
        }
        const space = tokens.space[val as string]?.val ?? 0
        return {
          px: space * 0.25,
          py: space * 0.25,
        }
      },
    },
  },
})

const ChipIcon = ChipIconFrame.styleable<ChipIconProps>((props, ref) => {
  const { children, scaleIcon = 0.7, size, color, ...rest } = props
  const chipContext = ChipContext.useStyledContext()
  const finalSize = size || chipContext.size

  const iconSize =
    (typeof finalSize === 'number'
      ? finalSize * 0.5
      : getFontSize(finalSize as FontSizeTokens)) * scaleIcon

  const getThemedIcon = useGetThemedIcon({ size: iconSize, color: color as any })
  return (
    <ChipIconFrame ref={ref} {...rest}>
      {getThemedIcon(children)}
    </ChipIconFrame>
  )
})

const CHIP_BUTTON = 'Button'

const ButtonComp = styled(View, {
  name: CHIP_BUTTON,
  context: ChipContext,
  focusable: true,
  role: 'button',
  variants: {
    size: {} as any,
    unstyled: {
      false: {
        rounded: 1000_000_000,
        bg: '$background',
        justify: 'center',
        items: 'center',
        hoverStyle: {
          bg: '$backgroundHover',
        },
        pressStyle: {
          bg: '$backgroundPress',
        },
        focusStyle: {
          bg: '$backgroundFocus',
        },
      },
    },
    alignRight: {
      ':boolean': (val, { props, tokens }: { props: { size?: SizeTokens }; tokens: { space: Record<string, { val: number }> } }) => {
        if (val) {
          const size = props.size ?? '$true'
          if (typeof size === 'number') {
            return {
              x: size * 0.55,
            }
          }
          return {
            x: (tokens.space[size as string]?.val ?? 0) * 0.55,
          }
        }
      },
    },
    alignLeft: {
      ':boolean': (val, { props, tokens }: { props: { size?: SizeTokens }; tokens: { space: Record<string, { val: number }> } }) => {
        if (val) {
          const size = props.size ?? '$true'
          if (typeof size === 'number') {
            return {
              x: size * -0.55,
            }
          }
          return {
            x: (tokens.space[size as string]?.val ?? 0) * -0.55,
          }
        }
      },
    },
  } as const,
  defaultVariants: {
    unstyled: false,
  },
})

export const Chip = withStaticProperties(ChipImpl, {
  Text: ChipText,
  Icon: ChipIcon,
  Button: ButtonComp,
})
