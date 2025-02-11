import Box from "components/common/Box";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useGlobalStateContext } from "state/GlobalState";
import ArtistManageSubscription from "./ArtistManageSubscription";
import ArtistSupportBox from "./ArtistSupportBox";
import { css } from "@emotion/css";
import { bp } from "../../constants";
import FollowArtist from "components/common/FollowArtist";
import HeaderDiv from "components/common/HeaderDiv";
import { useArtistContext } from "state/ArtistContext";

const ArtistSupport: React.FC = () => {
  const {
    state: { user },
    refreshLoggedInUser,
  } = useGlobalStateContext();

  const {
    state: { artist },
  } = useArtistContext();
  const { t } = useTranslation("translation", { keyPrefix: "artist" });
  const [isLoading, setIsLoading] = React.useState(false);
  const [userSubscription, setUserSubscription] =
    React.useState<ArtistUserSubscription>();
  const [userSubscriptionTier, setUserSubscriptionTier] =
    React.useState<ArtistSubscriptionTier>();
  const { search } = useLocation();
  const userId = user?.id;
  const artistId = artist?.id;
  const userSubscriptions = user?.artistUserSubscriptions;
  const artistTiers = artist?.subscriptionTiers;

  const checkForSubscription = React.useCallback(async () => {
    try {
      setIsLoading(true);
      if (userId) {
        const sub = userSubscriptions?.find(
          (aus) =>
            !aus.artistSubscriptionTier.isDefaultTier &&
            aus.artistSubscriptionTier.artistId === artistId
        );
        setUserSubscription(sub);

        const hasId = artistTiers?.find(
          (tier) => sub?.artistSubscriptionTierId === tier.id
        );
        setUserSubscriptionTier(hasId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userSubscriptions, artistTiers, artistId]);

  React.useEffect(() => {
    checkForSubscription();
  }, [checkForSubscription]);

  React.useEffect(() => {
    const query = new URLSearchParams(search);
    let interval: NodeJS.Timer | null = null;
    if (query.get("subscribe") === "success") {
      interval = setTimeout(async () => {
        refreshLoggedInUser();
      }, 1000 * 3);
    }
    return () => (interval ? clearTimeout(interval) : undefined);
  }, [refreshLoggedInUser, search]);

  if (!artist) {
    return null;
  }

  if (isLoading) {
    return <Box />;
  }

  if (userSubscriptionTier) {
    return (
      <ArtistManageSubscription
        userSubscription={userSubscription}
        reload={checkForSubscription}
        userSubscriptionTier={userSubscriptionTier}
      />
    );
  }

  return (
    <>
      <HeaderDiv>
        <div>
        </div>
        <div
          className={css`
            @media (max-width: ${bp.small}px) {
              margin-top: 0.15rem;
            }
          `}
        >
          <FollowArtist artistId={artist.id} />
        </div>
      </HeaderDiv>
      {artist.subscriptionTiers.length === 0 && (
        <Box
          className={css`
            text-align: center;
          `}
        >
          {t("noSubscriptionTiersYet")}
        </Box>
      )}
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;

          @media (max-width: ${bp.small}px) {
            flex-direction: column;
          }
        `}
      >
        {artist.subscriptionTiers?.map((p) => (
          <ArtistSupportBox key={p.id} subscriptionTier={p} />
        ))}
      </div>
    </>
  );
};

export default ArtistSupport;
