import type { RovingFocusGroupProps, RovingFocusItemProps } from '@tamagui/roving-focus'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import type { ElementRef, KeyboardEvent, PropsWithChildren } from 'react'
import { forwardRef } from 'react'
import type { CheckedState, YStackProps } from 'tamagui'
import {
  Group,
  H2,
  Checkbox as TCheckbox,
  styled,
  withStaticProperties,
  isWeb,
  createStyledContext,
  Label,
  View,
} from 'tamagui'

const CheckboxesContext = createStyledContext<{
  values: Record<string, boolean>
  onValuesChange: (values: Record<string, boolean>) => void
}>({
  values: {},
  onValuesChange: () => {},
})

const FocusGroup = forwardRef<ElementRef<typeof View>, RovingFocusGroupProps>(
  (props, ref) => {
    return (
      <RovingFocusGroup
        focusable
        outlineOffset={1}
        focusStyle={{
          z: 1000,
        }}
        {...props}
        ref={ref}
      />
    )
  }
)

const FocusItemContext = createStyledContext({
  value: '',
})

const FocusGroupItem = forwardRef<
  ElementRef<typeof View>,
  RovingFocusItemProps & { value: string }
>((props, ref) => {
  const { value, ...rest } = props
  const { values, onValuesChange } = CheckboxesContext.useStyledContext()

  const attrs = {
    focusable: true,
    outlineOffset: 1,
    shrink: 1,
    focusStyle: {
      z: 1,
    },
    ...(isWeb && {
      onKeyDown: (e: KeyboardEvent) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.code === 'Space') {
          onValuesChange({ ...values, [value]: !values[value] })
        }
      },
    }),
    onPress: () => {
      onValuesChange({ ...values, [value]: !values[value] })
    },
    ...rest,
  }

  return (
    <FocusItemContext.Provider value={value}>
      <RovingFocusGroup.Item ref={ref} {...attrs} />
    </FocusItemContext.Provider>
  )
})

const RadiusGroup = styled(Group, {
  orientation: 'vertical',
})

const Title = styled(H2, {
  size: '$8',
})

type CheckboxesProps<K extends string> = {
  values: Record<K, boolean>
  onValuesChange: (values: Record<K, boolean>) => void
} & YStackProps

const CheckboxesImp = <K extends string>(
  props: PropsWithChildren<CheckboxesProps<K>>
) => {
  const { values, onValuesChange, ...rest } = props

  return (
    <CheckboxesContext.Provider
      values={values as Record<string, boolean>}
      onValuesChange={onValuesChange as (values: Record<string, boolean>) => void}
    >
      <View {...rest} />
    </CheckboxesContext.Provider>
  )
}

const GroupCheckbox = TCheckbox.styleable((props, ref) => {
  const { ...rest } = props
  const { values, onValuesChange } = CheckboxesContext.useStyledContext()
  const { value: focusItemValue } = FocusItemContext.useStyledContext()

  const attrs = {
    checked: values[focusItemValue],
    onCheckedChange: (checked: CheckedState) => {
      onValuesChange({
        ...values,
        [focusItemValue]:
          typeof checked === 'boolean' ? checked : !values[focusItemValue],
      })
    },
    ...rest,
  }

  return <TCheckbox ref={ref} value={focusItemValue} {...attrs} />
})

type CardProps = {
  unstyled?: boolean
}

const CardFrame = styled(View, {
  cursor: 'pointer',
  width: '100%',
  rounded: '$4',
  p: '$3',
  bg: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
  focusStyle: {
    bg: '$backgroundFocus',
    borderColor: '$borderColorFocus',
  },
  hoverStyle: {
    bg: '$backgroundHover',
    borderColor: '$borderColorHover',
  },

  ...(isWeb && {
    pressStyle: {
      bg: '$backgroundPress',
      borderColor: '$borderColorPress',
    },
  }),

  variants: {
    active: {
      true: {
        bg: '$backgroundFocus',
        borderColor: '$borderColorFocus',
      },
    },
  } as const,
})

const Card = CardFrame.styleable<CardProps>((props, ref) => {
  const { ...rest } = props
  const { values } = CheckboxesContext.useStyledContext()
  const { value } = FocusItemContext.useStyledContext()

  const selected = values[value]

  return <CardFrame ref={ref} active={selected} {...rest} />
})

/** Standalone checkbox for simple toggles (e.g. todo completion). */
export const Checkbox = withStaticProperties(TCheckbox, {
  Indicator: TCheckbox.Indicator,
  Label,
})

export const Checkboxes = withStaticProperties(CheckboxesImp, {
  Group: withStaticProperties(RadiusGroup, {
    Item: Group.Item,
  }),
  /** FocusGroup is necessary for keyboard arrow navigation */
  FocusGroup: withStaticProperties(FocusGroup, {
    Item: FocusGroupItem,
  }),
  Title,
  Checkbox: withStaticProperties(GroupCheckbox, {
    Indicator: TCheckbox.Indicator,
    Label,
  }),
  Card,
})
