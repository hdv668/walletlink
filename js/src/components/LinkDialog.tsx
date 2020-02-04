// Copyright (c) 2018-2020 Coinbase, Inc. <https://coinbase.com/>
// Licensed under the Apache License, version 2.0

import clsx from "clsx"
import { FunctionComponent, h } from "preact"
import { useEffect, useState } from "preact/hooks"
import css from "./LinkDialog.css"
import { QRCode } from "./QRCode"

export const LinkDialog: FunctionComponent<{
  version: string
  sessionId: string
  sessionSecret: string
  walletLinkUrl: string
  isOpen: boolean
}> = props => {
  const [isContainerHidden, setContainerHidden] = useState(!props.isOpen)
  const [isDialogHidden, setDialogHidden] = useState(!props.isOpen)

  useEffect(() => {
    const { isOpen } = props
    const timers = [
      window.setTimeout(() => {
        setDialogHidden(!isOpen)
      }, 1)
    ]

    if (isOpen) {
      setContainerHidden(false)
    } else {
      timers.push(
        window.setTimeout(() => {
          setContainerHidden(true)
        }, 351)
      )
    }

    return () => {
      timers.forEach(window.clearTimeout)
    }
  })

  return (
    <div
      class={clsx(
        "-walletlink-link-dialog-container",
        isContainerHidden && "-walletlink-link-dialog-container-hidden"
      )}
    >
      <style>{css}</style>
      <div
        class={clsx(
          "-walletlink-link-dialog-backdrop",
          isDialogHidden && "-walletlink-link-dialog-backdrop-hidden"
        )}
      />
      <div class="-walletlink-link-dialog">
        <div
          class={clsx(
            "-walletlink-link-dialog-box",
            isDialogHidden && "-walletlink-link-dialog-box-hidden"
          )}
        >
          <div class="-walletlink-link-dialog-box-content">
            <ScanQRCode
              sessionId={props.sessionId}
              sessionSecret={props.sessionSecret}
              walletLinkUrl={props.walletLinkUrl}
            />
          </div>

          <div class="-walletlink-link-dialog-box-footer">
            <p>Powered by WalletLink</p>
            <small>v{props.version}</small>
          </div>
        </div>
      </div>
    </div>
  )
}

const ScanQRCode: FunctionComponent<{
  sessionId: string
  sessionSecret: string
  walletLinkUrl: string
}> = props => {
  const serverUrl = window.encodeURIComponent(props.walletLinkUrl)
  const qrUrl = `${props.walletLinkUrl}/#/link?id=${props.sessionId}&secret=${props.sessionSecret}&server=${serverUrl}`

  return (
    <div class="-walletlink-link-dialog-box-content">
      <h3>Scan QR Code</h3>
      <h4>to connect mobile wallet</h4>

      <div class="-walletlink-link-dialog-box-content-qrcode">
        <QRCode content={qrUrl} width={224} height={224} />
        <input type="hidden" value={qrUrl} />
      </div>

      <ol>
        <li>Open compatible wallet app</li>
        <li>Find and open the QR scanner</li>
        <li>Scan this QR code</li>
      </ol>
    </div>
  )
}
