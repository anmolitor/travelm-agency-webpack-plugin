import intl_proxy from "intl-proxy";
import { Elm } from "./Main.elm";

Elm.Main.init({ flags: { intl: intl_proxy, language: "en" } });
