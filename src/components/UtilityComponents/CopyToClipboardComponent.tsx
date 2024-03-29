'use client'
import {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../contexts/AppContext";
import { Popover } from "bootstrap";
interface CopyToClipboardComponentProps {
  copyText: string;
  children?: HTMLElement;
  classes?: string;
  popOverId: string;
  card: any;
}
export const CopyToClipboardComponent: FunctionComponent<
  CopyToClipboardComponentProps
> = ({ copyText, classes, popOverId, card }) => {
  const appContextValues = useContext(AppContext);
  useEffect(() => {
    let popoverInstance: Popover;
    let bootStrapMasterClass = appContextValues?.appState?.bootstrap;
    const popoverTrigger = document.getElementById(popOverId) as any;
    if (bootStrapMasterClass && popoverTrigger) {
      popoverInstance = new bootStrapMasterClass.Popover(popoverTrigger);
    }
    return () => {
      popoverInstance?.dispose();
    };
  }, [appContextValues?.appState?.bootstrap]);

  // This is the function we wrote earlier
  const copyTextToClipboard = async (text: string) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <input
        type="text"
        value={copyText}
        readOnly
        className="d-none"
        title="hidden text copy input"
      />
      {/* Bind our handler function to the onClick button property */}
      <span
        tabIndex={0}
        // title={isCopied ? "Copied!" : "Copy to clipboard."}
        id={popOverId}
        data-bs-toggle="popover"
        //data-bs-title="Copy to clipboard."
        onClick={(e) => {
          e.stopPropagation();
        }}
        // data-bs-custom-class="bg-grey"
        data-bs-trigger=" focus"
        data-bs-content={`Link to ${card.name} copied to clipboard!`}
        className="text-warning span-link white-hover"
      >
        <FontAwesomeIcon
          className={"cursor-pointer user-select-none " + classes}
          icon={faCopy}
          onClick={handleCopyClick}
        />
      </span>
    </Fragment>
  );
};
