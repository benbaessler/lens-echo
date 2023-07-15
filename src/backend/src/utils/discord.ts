import { EmbedBuilder } from "discord.js";
import { ProfileFragment, MetadataFragment } from "@lens-protocol/client";
import {
  getPictureUrl,
  getDisplayName,
  getMediaUrl,
  getProfileUrl,
  capitalize,
} from "@lens-echo/core";
import { appIcons } from "../constants";
import { Profile } from "../generated";
import { captureException } from "@sentry/node";

interface PublicationEmbedOptions {
  id: string;
  metadata: MetadataFragment | any;
  profile: ProfileFragment | Profile;
  appId?: string;
}

export const PublicationEmbed = ({
  id,
  metadata,
  profile,
  appId,
}: PublicationEmbedOptions) => {
  const embedUrl = getPublicationUrl(id);

  const mainEmbed = new EmbedBuilder()
    .setTimestamp()
    .setColor(0x00501e)
    .setURL(embedUrl)
    .setAuthor({
      name: getDisplayName(profile as any),
      iconURL: getPictureUrl(profile as any),
      url: getProfileUrl(profile.handle),
    });

  if (metadata.content) {
    let { content } = metadata;
    if (content.length > 4096) {
      content = content.substring(0, 4093) + "...";
    }
    mainEmbed.setDescription(content);
  }

  if (appId)
    mainEmbed.setFooter({
      text: `From ${capitalize(appId)}`,
      iconURL: appIcons[appId.toLowerCase()] ?? appIcons.unknown,
    });

  const embeds = [mainEmbed];
  const media = metadata.media;
  if (media && media.length > 0) {
    try {
      mainEmbed.setImage(getMediaUrl(media[0]));
    } catch (err) {
      captureException(`Error parsing media: ${err}`);
    }
    for (let i = 1; i < media.length; i++) {
      try {
        embeds.push(
          new EmbedBuilder().setURL(embedUrl).setImage(getMediaUrl(media[i]))
        );
      } catch (err) {
        captureException(`Error parsing media: ${err}`);
      }
    }
  }
  return embeds;
};

export const MessageContent = (
  action: string,
  publicationUrl: string,
  targetHandle?: string
) => {
  if (!targetHandle) {
    // Posted, Mirrored, Collected
    return `[${action}](${publicationUrl})`;
  } else if (action == "Commented") {
    return `[${action}](${publicationUrl}) on post by [@${targetHandle}](${getProfileUrl(
      targetHandle
    )})`;
  }
  // Quoted
  return `[${action}](${publicationUrl}) [@${targetHandle}](${getProfileUrl(
    targetHandle
  )})`;
};

export const getPublicationUrl = (publicationId: string) =>
  `https://lensvert.xyz/p/${publicationId}`;