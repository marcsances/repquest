import React from "react";
import PropTypes from "prop-types";

const YoutubeEmbed = (props: { embedId: string }) => (
    <div className="video-responsive">
        <iframe
            src={`https://www.youtube.com/embed/${props.embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </div>
);

YoutubeEmbed.propTypes = {
    embedId: PropTypes.string.isRequired
};

export default YoutubeEmbed;