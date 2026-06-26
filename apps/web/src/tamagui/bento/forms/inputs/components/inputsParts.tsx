// Bento Input — runtime v2
import { getFontSized } from '@tamagui/get-font-sized'
import { getSpace } from '@tamagui/get-token'
import { useState } from 'react'
import type { ColorTokens, FontSizeTokens, SizeTokens } from 'tamagui'
import {
  Label,
  Button as TButton,
  Input as TInput,
  Text,
  View,
  XGroup,
  createStyledContext,
  getFontSize,
  getVariable,
  isWeb,
  styled,
  useGetThemedIcon,
  useTheme,
  withStaticProperties,
} from 'tamagui'

const defaultContextValues = {
  size: '$true',
  scaleIcon: 1.2,
  color: undefined,
} as const

export const InputContext = createStyledContext<{
  size: FontSizeTokens
  scaleIcon: number
  color?: ColorTokens | string
}>(defaultContextValues)

export const defaultInputGroupStyles = {
  size: '$true',
  fontFamily: '$body',
  borderWidth: 1,
  outlineWidth: 0,
  color: '$color',

  ...(isWeb
    ? {
        tabIndex: 0,
      }
    : {
        focusable: true,
      }),

  borderColor: '$borderColor',
  bg: '$color2',

  // this fixes a flex bug where it overflows container
  minW: 0,

  hoverStyle: {
    borderColor: '$borderColorHover',
  },

  focusStyle: {
    outlineColor: '$outlineColor',
    outlineWidth: 2,
    outlineStyle: 'solid',
    borderColor: '$borderColorFocus',
  },
} as const

const InputGroupFrame = styled(XGroup, {
  justify: 'space-between',
  context: InputContext,
  variants: {
    unstyled: {
      false: defaultInputGroupStyles,
    },
    scaleIcon: {
      ':number': {} as any,
    },
    size: {
      '...size': ((val: SizeTokens, { tokens }: { tokens: { radius: Record<string, unknown> } }) => ({
        rounded: tokens.radius[val as string],
      })) as never,
    },
  } as const,
  defaultVariants: {
    unstyled: false as const,
  },
})

const FocusContext = createStyledContext({
  setFocused: (_focused: boolean) => {},
  focused: false,
})

const InputGroupImpl = InputGroupFrame.styleable((props, forwardedRef) => {
  const { children, ...rest } = props
  const [focused, setFocused] = useState(false)

  return (
    <FocusContext.Provider focused={focused} setFocused={setFocused}>
      <InputGroupFrame
        ref={forwardedRef}
        {...rest}
        {...(focused
          ? { focusStyle: rest.focusStyle || defaultInputGroupStyles.focusStyle }
          : null)}
      >
        {children}
      </InputGroupFrame>
    </FocusContext.Provider>
  )
})

export const inputSizeVariant = (
  val: SizeTokens = '$true',
  extras: { tokens: { radius: Record<string, unknown> }; props: { circular?: boolean } }
) => {
  const radiusToken =
    extras.tokens.radius[val as string] ?? extras.tokens.radius['$true']
  const paddingHorizontal = getSpace(val, {
    shift: -1,
    bounds: [2],
  })
  const fontStyle = getFontSized(val as FontSizeTokens, extras as never)
  // lineHeight messes up input on native
  if (!isWeb && fontStyle) {
    delete fontStyle['lineHeight']
  }
  return {
    ...fontStyle,
    height: val,
    rounded: extras.props.circular ? 100_000 : radiusToken,
    paddingHorizontal,
  }
}

const InputFrame = styled(TInput, {
  unstyled: true,
})

const InputImpl = InputFrame.styleable((props, ref) => {
  const { setFocused } = FocusContext.useStyledContext()
  const { size } = InputContext.useStyledContext()
  const { ...rest } = props
  return (
    <View flex={1}>
      <InputFrame
        ref={ref}
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => setFocused(false)}
        size={size}
        {...rest}
      />
    </View>
  )
})

const InputSection = styled(XGroup.Item, {
  justify: 'center',
  items: 'center',
})

const Button = styled(TButton, {
  context: InputContext,
  justify: 'center',
  items: 'center',

  variants: {
    pressTheme: {
      true: {},
      false: {},
    },
    scaleIcon: {
      ':number': {} as any,
    },
    size: {
      '...size': ((val: SizeTokens = '$true', { tokens }: { tokens: { radius: Record<string, unknown> } }) => {
        if (typeof val === 'number') {
          return {
            px: 0,
            height: val,
            rounded: val * 0.2,
          }
        }
        return {
          px: 0,
          height: val,
          rounded: tokens.radius[val as string],
        }
      }) as never,
    },
  } as const,
})

// Icon starts

export const InputIconFrame = styled(View, {
  justify: 'center',
  items: 'center',
  context: InputContext,

  variants: {
    scaleIcon: {
      ':number': {} as any,
    },
    size: {
      '...size': (val: SizeTokens, { tokens }: { tokens: { space: Record<string, { val: number }> } }) => {
        return {
          px: tokens.space[val as string]?.val,
        }
      },
    },
  } as const,
})

const getIconSize = (size: FontSizeTokens, scale: number) => {
  return (
    (typeof size === 'number' ? size * 0.5 : getFontSize(size as FontSizeTokens)) * scale
  )
}

const InputIcon = InputIconFrame.styleable<{
  scaleIcon?: number
  color?: ColorTokens | string
}>((props, ref) => {
  const { children, color: colorProp, scaleIcon: _scaleIcon, ...rest } = props
  const inputContext = InputContext.useStyledContext()
  const { size = '$true', color: contextColor, scaleIcon = 1 } = inputContext

  const theme = useTheme()
  const color = getVariable(
    contextColor || theme[contextColor as any]?.get('web') || theme.color10?.get('web')
  )
  const iconSize = getIconSize(size as FontSizeTokens, scaleIcon)

  const getThemedIcon = useGetThemedIcon({ size: iconSize, color: color as any })
  return (
    <InputIconFrame ref={ref} {...rest}>
      {getThemedIcon(children)}
    </InputIconFrame>
  )
})

export const InputContainerFrame = styled(View, {
  context: InputContext,
  flexDirection: 'column',

  variants: {
    size: {
      '...size': (val: SizeTokens, { tokens }: { tokens: { space: Record<string, { val: number }> } }) => ({
        gap: (tokens.space[val as string]?.val ?? 0) * 0.3,
      }),
    },
    gapScale: {
      ':number': {} as any,
    },
    scaleIcon: {
      ':number': {} as any,
    },
  } as const,

  defaultVariants: {
    size: '$4',
  },
})

const InputLabelFrame = styled(Label, {
  variants: {
    size: {
      '...fontSize': getFontSized as any,
    },
  } as const,
})

export const InputLabel = InputLabelFrame.styleable((props, ref) => {
  const { size } = InputContext.useStyledContext()
  const { ...rest } = props
  return <InputLabelFrame ref={ref} size={size} {...rest} />
})

const InputInfoFrame = styled(Text, {
  color: '$color10',

  variants: {
    size: {
      '...fontSize': (val, { font }) => {
        if (!font) return
        const fontSize = font.size[val].val * 0.8
        const lineHeight = font.lineHeight?.[val].val * 0.8
        const fontWeight = font.weight?.['$2']
        const letterSpacing = font.letterSpacing?.[val]
        const textTransform = font.transform?.[val]
        const fontStyle = font.style?.[val]
        return {
          fontSize,
          lineHeight,
          fontWeight,
          letterSpacing,
          textTransform,
          fontStyle,
        }
      },
    },
  } as const,
})

export const InputInfo = InputInfoFrame.styleable((props, ref) => {
  const { size } = InputContext.useStyledContext()
  const { ...rest } = props
  return <InputInfoFrame ref={ref} size={size} {...rest} />
})

const InputXGroup = styled(XGroup, {
  context: InputContext,

  variants: {
    size: {
      '...size': ((val: SizeTokens, { tokens }: { tokens: { radius: Record<string, unknown> } }) => {
        const radiusToken = tokens.radius[val as string] ?? tokens.radius['$true']
        return {
          rounded: radiusToken,
        }
      }) as never,
    },
  } as const,
})

export const Input = withStaticProperties(InputContainerFrame, {
  Box: InputGroupImpl,
  Area: InputImpl,
  Section: InputSection,
  Button,
  Icon: InputIcon,
  Info: InputInfo,
  Label: InputLabel,
  XGroup: withStaticProperties(InputXGroup, { Item: XGroup.Item }),
})
