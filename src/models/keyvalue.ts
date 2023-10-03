import {ReactElement} from "react";

interface KeyValue<K = string, V = string> {
    key: K;
    value: V;
    icon?: ReactElement;
}

export default KeyValue;
