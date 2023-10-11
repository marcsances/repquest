import {ReactElement} from "react";

interface KeyValue<K = string, V = string, T = object> {
    key: K;
    value: V;
    icon?: ReactElement;
    extras?: T;
}

export default KeyValue;
