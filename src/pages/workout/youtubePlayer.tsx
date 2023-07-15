import React from "react";
import Layout from "../../components/layout";
import YoutubeEmbed from "../../components/youtube";

export const YoutubePlayer = (props: { embedId: string, exerciseName: string }) => {
    const {exerciseName, embedId} = props;
    return <Layout title={exerciseName} hideNav>
        <YoutubeEmbed embedId={embedId}/>
    </Layout>;
}