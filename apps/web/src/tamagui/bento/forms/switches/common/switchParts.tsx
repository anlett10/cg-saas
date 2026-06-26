import { getSize } from '@tamagui/get-token'
import type { ColorTokens, FontSizeTokens, SizeTokens } from 'tamagui'
import {
  createSwitch,
  View,
  getVariableValue,
  styled,
  getFontSize,
  useTheme,
  getVariable,
  useGetThemedIcon,
  withStaticProperties,
  SwitchStyledContext,
} from 'tamagui'

const getSwitchHeight = (val: SizeTokens) =>
  Math.round(getVariableValue(getSize(val)) * 0.65)

const getSwitchWidth = (val: SizeTokens) => getSwitchHeight(val) * 2

export const SwitchThumb = styled(View, {
  name: 'SwitchThumb',
  transition: 'quick',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        bg: '$gray12' as ColorTokens,
        rounded: 1000,
      },
    },

    checked: {
      true: {},
    },

    size: {
      '...size': ((val: SizeTokens) => {
        const size = getSwitchHeight(val)
        return {
          height: size,
          width: size,
        }
      }) as never,
    },
  } as const,

  defaultVariants: {
    unstyled: false as const,
  },
})

export const SwitchFrame = styled(View, {
  name: 'Switch',
  render: 'button',

  variants: {
    unstyled: {
      false: {
        rounded: 1000,
        bg: '$background',
        borderWidth: 2,
        borderColor: '$background',

        focusStyle: {
          outlineColor: '$outlineColor',
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      },
    },

    checked: {
      true: {
        bg: '$green10',
      },
      false: {
        bg: '$red10',
      },
    },

    size: {
      '...size': ((val: SizeTokens) => {
        const height = getSwitchHeight(val) + 4
        const width = getSwitchWidth(val) + 4
        return {
          height,
          minHeight: height,
          width,
        }
      }) as never,
    },
  } as const,

  defaultVariants: {
    unstyled: false as const,
  },
})

const SwitchIconFrame = styled(View, {
  position: 'absolute',
  context: SwitchStyledContext,
  height: '100%',
  justify: 'center',
  items: 'center',
  variants: {
    placement: {
      right: (_, { props, tokens }: { props: { size?: SizeTokens }; tokens: { space: Record<string, { val: number }> } }) => {
        const amount = (tokens.space[String(props.size ?? '$true')]?.val ?? 0) * 0.35
        return {
          right: amount,
        }
      },
      left: (_, { props, tokens }: { props: { size?: SizeTokens }; tokens: { space: Record<string, { val: number }> } }) => {
        const amount = (tokens.space[String(props.size ?? '$true')]?.val ?? 0) * 0.35
        return {
          left: amount,
        }
      },
    },
    size: {
      '...size': {} as never,
    },
  } as const,
  defaultVariants: {
    placement: 'right',
  },
})

const getIconSize = (size: FontSizeTokens, scale: number) => {
  return (
    (typeof size === 'number' ? size * 0.5 : getFontSize(size as FontSizeTokens)) * scale
  )
}
export const SwitchIcon = SwitchIconFrame.styleable<{
  scaleIcon?: number
  color?: ColorTokens | string
}>((props, ref) => {
  const { children, color: colorProp, scaleIcon = 1.2, ...rest } = props
  const { size } = SwitchStyledContext.useStyledContext()

  const theme = useTheme()
  const color = getVariable(
    colorProp || theme[colorProp as keyof typeof theme]?.get('web') || theme.color10?.get('web')
  )
  const iconSize = getIconSize(size as FontSizeTokens, scaleIcon)

  const getThemedIcon = useGetThemedIcon({ size: iconSize, color: color as ColorTokens })
  return (
    <SwitchIconFrame ref={ref} {...rest}>
      {getThemedIcon(children)}
    </SwitchIconFrame>
  )
})

const SwitchComp = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})

export const Switch = withStaticProperties(SwitchComp, {
  Icon: SwitchIcon,
})
