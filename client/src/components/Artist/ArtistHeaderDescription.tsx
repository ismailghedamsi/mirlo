import { css } from "@emotion/css";
import MarkdownContent from "components/common/MarkdownContent";
import { bp } from "../../constants";
import { useGlobalStateContext } from "state/GlobalState";
import { useTranslation } from "react-i18next";
import Button from "components/common/Button";
import React from "react";
import { useArtistContext } from "state/ArtistContext";
import api from "services/api";
import { useSnackbar } from "state/SnackbarContext";
import { useForm } from "react-hook-form";
import { FaPen, FaSave, FaTimes } from "react-icons/fa";
import TextArea from "components/common/TextArea";

interface FormData {
  bio: string;
}

const ArtistHeaderDescription: React.FC = () => {
  const {
    state: { user },
  } = useGlobalStateContext();
  const {
    state: { artist },
    refresh,
  } = useArtistContext();
  const snackbar = useSnackbar();
  const artistAvatar = artist?.avatar?.sizes;

  const { t } = useTranslation("translation", { keyPrefix: "artist" });
  const [isEditing, setIsEditing] = React.useState(false);
  const userId = user?.id;
  const artistId = artist?.id;
  const artistUserId = artist?.userId;
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { bio: artist?.bio },
  });

  let bio =
    user && user.id === artist?.userId && !artist.bio
      ? t("noBioYet")
      : artist?.bio;

  const doSave = React.useCallback(
    async (data: FormData) => {
      try {
        if (userId && artistId && artistUserId === userId) {
          await api.put(`users/${userId}/artists/${artistId}`, {
            bio: data.bio,
          });
        }
        refresh();
        snackbar(t("updatedBio"), { type: "success" });
      } catch (e) {
      } finally {
        setIsEditing(false);
      }
    },
    [artistId, artistUserId, refresh, snackbar, userId, t]
  );
  if (!isEditing) {
    return (
      <div>
        <MarkdownContent
          content={bio}
          className={css`
            padding-bottom: 0.5rem;
            @media screen and (max-width: ${bp.medium}px) {
              ${artistAvatar ? "padding-bottom: .2rem;" : ""}
            }
          `}
        />
        {user && user.id === artist?.userId && (
          <Button
            compact
            onClick={() => setIsEditing(true)}
            startIcon={<FaPen />}
          >
            {t("editBioButton")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className={css`
          width: 100%;
        `}
      >
        <TextArea
          {...register(`bio`)}
          placeholder="Let listeners know a bit about yourself"
        />
        <Button
          compact
          startIcon={<FaSave />}
          onClick={handleSubmit(doSave)}
          className={css`
            margin-right: 0.5rem;
          `}
        >
          {t("saveBio")}
        </Button>
        <Button
          compact
          startIcon={<FaTimes />}
          onClick={() => {
            reset();
            setIsEditing(false);
          }}
        >
          {t("cancel")}
        </Button>
      </div>
    </>
  );
};

export default ArtistHeaderDescription;
