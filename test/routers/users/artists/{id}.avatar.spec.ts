import assert from "node:assert";

import * as dotenv from "dotenv";
dotenv.config();
import { describe, it } from "mocha";
import request from "supertest";
import { clearTables, createArtist, createUser } from "../../../utils";
import prisma from "../../../../prisma/prisma";
import {
  minioClient,
  createBucketIfNotExists,
  finalArtistAvatarBucket,
} from "../../../../src/utils/minio";

import { requestApp } from "../../utils";

describe("users/{userId}/artists/{artistId}/avatar", () => {
  beforeEach(async () => {
    try {
      await clearTables();
    } catch (e) {
      console.error(e);
    }
  });

  describe("DELETE", () => {
    it("should DELETE with one artist", async () => {
      const { user, accessToken } = await createUser({ email: "test@testcom" });
      const artist = await createArtist(user.id);
      await createBucketIfNotExists(minioClient, finalArtistAvatarBucket);

      await prisma.artistAvatar.create({
        data: {
          artistId: artist.id,
        },
      });

      const response = await requestApp
        .delete(`users/${user.id}/artists/${artist.id}/avatar`)
        .set("Cookie", [`jwt=${accessToken}`])
        .set("Accept", "application/json");

      const foundOld = await prisma.artistAvatar.findFirst({
        where: { artistId: artist.id },
      });

      assert.equal(response.statusCode, 200);
      assert.equal(foundOld, null);

      // TODO: make sure image folder was deleted
    });
  });
});
