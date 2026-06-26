import React, { useState } from 'react'
import type { AlertDialogContentProps } from 'tamagui'
import { AlertDialog, Button, View, createContext, useEvent } from 'tamagui'

import { bentoTheme } from '@/tamagui/bento-theme-types'

export type AlertButton = {
  title: string
  action: () => void
  style: 'default' | 'cancel' | 'destructive'
}

export type AlertParam = {
  title: string
  message: string
  buttons: AlertButton[]
}

interface AlertDialogContextProps {
  open: boolean
  title: string
  message: string
  buttons: AlertButton[]
  alert: (param: AlertParam) => void
}

const [AlertProvider, useAlert] = createContext<AlertDialogContextProps>('Alert', {
  open: false,
  title: '',
  message: '',
  buttons: [],
  alert: () => {},
})

type AlertProps = AlertDialogContentProps & {
  children: React.ReactNode
}
export { useAlert }

export const Alert = ({ children, ...rest }: AlertProps) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [buttons, setButtons] = useState<AlertButton[]>([])

  const alert = useEvent(({ title, message, buttons }: AlertParam) => {
    setTitle(title)
    setMessage(message)
    setButtons(buttons)
    setOpen(true)
  })

  const closeDialog = useEvent(() => {
    setOpen(false)
  })

  return (
    <AlertProvider
      open={open}
      message={message}
      title={title}
      buttons={buttons}
      alert={alert}
    >
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            onPress={closeDialog}
            key="overlay"
            transition="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            bg="rgba(0,0,0,0.5)"
          />
          <AlertDialog.Content
            p="$4"
            pt="$3"
            pb="$2"
            bg="$color1"
            rounded="$4"
            gap="$1"
            key="content"
            transition={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -10, opacity: 0, scale: 0.95 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            $theme-dark={{
              borderColor: '$color6',
              borderWidth: 1,
            }}
            {...rest}
          >
            <View>
              <AlertDialog.Title size="$3">{title}</AlertDialog.Title>
              <AlertDialog.Description theme={bentoTheme('alt1')}>
                {message}
              </AlertDialog.Description>
            </View>
            <View flexDirection="row" gap="$4" justify="flex-end">
              {buttons.map((button, index) => {
                const Base =
                  button.style === 'cancel' ? AlertDialog.Cancel : AlertDialog.Action
                const color = button.style === 'destructive' ? '$red10' : '$color'
                return (
                  <Base key={index} asChild>
                    <Button
                      chromeless
                      onPress={button.action}
                      ref={(b) => {
                        if (!b) return
                        if (button.style === 'destructive') {
                          if (b instanceof HTMLElement) {
                            b.focus()
                          }
                        }
                      }}
                    >
                      <Button.Text color={color}>{button.title}</Button.Text>
                    </Button>
                  </Base>
                )
              })}
            </View>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
      {children}
    </AlertProvider>
  )
}

const AlertDialogTest = (_props: Record<string, never>) => {
  const { alert } = useAlert('AlertTest')

  const buttons: AlertButton[] = [
    {
      title: 'No',
      style: 'cancel',
      action: () => {
        // do some
      },
    },
    {
      title: 'Yes',
      style: 'destructive',
      action: () => {
        // do some
      },
    },
  ]

  return (
    <Button
      onPress={() => {
        alert({
          title: 'Warning',
          message: 'Are you sure you want to delete all your data?',
          buttons,
        })
      }}
    >
      Open Alert
    </Button>
  )
}

/** ---------- EXAMPLE --------- */
export const AlertDemo = () => {
  return (
    <Alert width={300}>
      <AlertDialogTest />
    </Alert>
  )
}

AlertDemo.fileName = 'Alert'
