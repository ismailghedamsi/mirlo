import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useArtistContext } from "state/ArtistContext";
import AlbumForm from "./AlbumForm";
import BulkTrackUpload from "./BulkTrackUpload";
import ManageTrackTable from "./ManageTrackTable";
import useGetUserObjectById from "utils/useGetUserObjectById";
import { useGlobalStateContext } from "state/GlobalState";
import PublishButton from "./PublishButton";
import HeaderDiv from "components/common/HeaderDiv";
import ManageSectionWrapper from "./ManageSectionWrapper";
import { css } from "@emotion/css";
import LoadingBlocks from "components/Artist/LoadingBlocks";
import BackToArtistLink from "./BackToArtistLink";

const ManageTrackGroup: React.FC<{}> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "manageAlbum" });

  const { artistId, trackGroupId } = useParams();
  const {
    state: { user },
  } = useGlobalStateContext();
  const {
    state: { artist, isLoading },
  } = useArtistContext();

  const userId = user?.id;

  const {
    object: trackGroup,
    reload,
    isLoadingObject: isLoadingTrackGroup,
  } = useGetUserObjectById<TrackGroup>(
    "trackGroups",
    userId,
    trackGroupId,
    `?artistId=${artistId}`
  );

  if (!artist && isLoading) {
    return <LoadingBlocks />;
  } else if (!artist) {
    return null;
  } else if (!trackGroup && isLoadingTrackGroup) {
    return <LoadingBlocks />;
  } else if (!trackGroup) {
    return null;
  }

  return (
    <ManageSectionWrapper
      className={css`
        padding-top: 1rem !important;
      `}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        `}
      >
        <BackToArtistLink />
        <HeaderDiv>
          <h1
            className={css`
              display: flex;
              align-items: center;
            `}
          >
            <span className={css``}>
              {t(trackGroup ? "editAlbum" : "createAlbum")}
            </span>
          </h1>
          <div
            className={css`
              display: flex;
              align-items: center;
            `}
          >
            {trackGroup && trackGroup.tracks?.length > 0 && (
              <PublishButton trackGroup={trackGroup} reload={reload} />
            )}
          </div>
        </HeaderDiv>
      </div>
      <AlbumForm existing={trackGroup} reload={reload} artist={artist} />
      <h4
        className={css`
          margin-top: 1.5rem;
        `}
      >
        {t("uploadTracks")}
      </h4>

      {trackGroup && trackGroup?.tracks?.length > 0 && (
        <ManageTrackTable
          tracks={trackGroup.tracks}
          editable
          trackGroupId={trackGroup.id}
          owned
          reload={reload}
        />
      )}

      {trackGroup && (
        <BulkTrackUpload trackgroup={trackGroup} reload={reload} />
      )}
      <hr style={{ marginTop: "1rem", marginBottom: "1rem" }} />
      {trackGroup && trackGroup.tracks?.length > 0 && (
        <PublishButton trackGroup={trackGroup} reload={reload} />
      )}
    </ManageSectionWrapper>
  );
};

export default ManageTrackGroup;
