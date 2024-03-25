import {Box, Popper} from "@mui/material";
import EmojiPicker, {EmojiStyle, Theme} from "emoji-picker-react";
import {useTranslation} from "react-i18next";
import {SettingsContext} from "../context/settingsContext";
import {useContext} from "react";

export interface EmojiDropdownProps {
    onChange: (value: string) => void;
    onClose?: () => void;
    open?: boolean;
    anchorEl?: HTMLElement;
    startExpanded?: boolean;
}

const EmojiDropdown = (props: EmojiDropdownProps) => {
    const { onClose, onChange, open, startExpanded, anchorEl } = props;
    const {t} = useTranslation();
    const {emojis} = useContext(SettingsContext);
    return <Popper sx={{zIndex: 120000}} open={!!open} anchorEl={anchorEl} placement="top-start">
                <Box>
                    <EmojiPicker autoFocusSearch={false} searchPlaceholder={t("search")} lazyLoadEmojis reactions={emojis} onEmojiClick={(emoji) => {
                        onChange(emoji.emoji); if (onClose) onClose();
                    }} theme={Theme.DARK} emojiStyle={EmojiStyle.NATIVE} reactionsDefaultOpen={!startExpanded} />
                </Box>
    </Popper>;
}

export default EmojiDropdown;
