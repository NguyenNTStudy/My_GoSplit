-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- Hand-written: extensions for accent-free fuzzy search (R34). Kept here because the
-- schema's `extensions` field is still a Prisma preview feature.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- CreateEnum
CREATE TYPE "PlanKind" AS ENUM ('basic', 'detailed');

-- CreateEnum
CREATE TYPE "SummaryStatus" AS ENUM ('open', 'locked', 'final');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('owner', 'editor', 'viewer');

-- CreateEnum
CREATE TYPE "GrantedRole" AS ENUM ('editor', 'viewer');

-- CreateEnum
CREATE TYPE "JoinedVia" AS ENUM ('created', 'invite', 'request');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ContributionKind" AS ENUM ('contribution', 'refund');

-- CreateEnum
CREATE TYPE "MealSlot" AS ENUM ('morning', 'afternoon', 'evening');

-- CreateEnum
CREATE TYPE "EmailTokenPurpose" AS ENUM ('unlock');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('published', 'hidden', 'removed');

-- CreateEnum
CREATE TYPE "GuideReportReason" AS ENUM ('ads', 'wrong_info', 'closed', 'inappropriate');

-- CreateEnum
CREATE TYPE "ItineraryReportReason" AS ENUM ('ads', 'wrong_info', 'personal_info', 'inappropriate');

-- CreateEnum
CREATE TYPE "RecruitPostStatus" AS ENUM ('open', 'closed', 'hidden', 'removed');

-- CreateEnum
CREATE TYPE "RecruitClosedReason" AS ENUM ('full', 'owner', 'started', 'summary');

-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('pending', 'accepted', 'declined', 'withdrawn', 'expired');

-- CreateEnum
CREATE TYPE "RecruitReportReason" AS ENUM ('fraud', 'ads', 'wrong_info', 'inappropriate');

-- CreateEnum
CREATE TYPE "AccountReportReason" AS ENUM ('fraud', 'harassment', 'impersonation', 'inappropriate');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "username" TEXT,
    "displayUsername" TEXT,
    "role" TEXT,
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMPTZ(3),
    "language" VARCHAR(8),
    "userTag" VARCHAR(12) NOT NULL,
    "publicId" VARCHAR(32) NOT NULL,
    "recruitEmails" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "impersonatedBy" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMPTZ(3),
    "refreshTokenExpiresAt" TIMESTAMPTZ(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "planId" VARCHAR(16) NOT NULL,
    "shareKey" TEXT NOT NULL,
    "kind" "PlanKind" NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "location" TEXT,
    "startDate" DATE,
    "endDate" DATE,
    "notes" TEXT,
    "currency" CHAR(3) NOT NULL,
    "theme" TEXT,
    "coverImagePath" TEXT,
    "coverImageCrop" JSONB,
    "ownerId" TEXT NOT NULL,
    "ownerParticipantId" UUID,
    "collectorParticipantId" UUID,
    "passcodeHash" TEXT NOT NULL,
    "passcodeVersion" INTEGER NOT NULL DEFAULT 1,
    "failedPasscodeAttempts" INTEGER NOT NULL DEFAULT 0,
    "passcodeLockedUntil" TIMESTAMPTZ(3),
    "unlockEmailSentAt" TIMESTAMPTZ(3),
    "editLockSessionId" TEXT,
    "editLockExpiresAt" TIMESTAMPTZ(3),
    "summaryStatus" "SummaryStatus" NOT NULL DEFAULT 'open',
    "summaryStatusChangedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("planId")
);

-- CreateTable
CREATE TABLE "PlanMember" (
    "planId" VARCHAR(16) NOT NULL,
    "accountId" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL,
    "participantId" UUID NOT NULL,
    "joinedVia" "JoinedVia" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanMember_pkey" PRIMARY KEY ("planId","accountId")
);

-- CreateTable
CREATE TABLE "PlanInvite" (
    "inviteId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "participantId" UUID NOT NULL,
    "role" "GrantedRole" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "usedAt" TIMESTAMPTZ(3),
    "usedByAccountId" TEXT,
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanInvite_pkey" PRIMARY KEY ("inviteId")
);

-- CreateTable
CREATE TABLE "EmailToken" (
    "id" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "purpose" "EmailTokenPurpose" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "usedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "participantId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("participantId")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "contributionId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "participantId" UUID NOT NULL,
    "kind" "ContributionKind" NOT NULL,
    "amount" DECIMAL(14,3) NOT NULL,
    "dateTime" TIMESTAMP(3),
    "note" TEXT,
    "batchId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("contributionId")
);

-- CreateTable
CREATE TABLE "PaymentQr" (
    "planId" VARCHAR(16) NOT NULL,
    "imagePath" TEXT NOT NULL,
    "label" TEXT,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "PaymentQr_pkey" PRIMARY KEY ("planId")
);

-- CreateTable
CREATE TABLE "Expense" (
    "expenseId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(14,3) NOT NULL,
    "paidByParticipantId" UUID NOT NULL,
    "dateTime" TIMESTAMP(3),
    "notes" TEXT,
    "activityId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("expenseId")
);

-- CreateTable
CREATE TABLE "ExpenseShare" (
    "expenseId" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "ratio" DECIMAL(12,4) NOT NULL DEFAULT 1,

    CONSTRAINT "ExpenseShare_pkey" PRIMARY KEY ("expenseId","participantId")
);

-- CreateTable
CREATE TABLE "Activity" (
    "activityId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE,
    "time" VARCHAR(5),
    "location" TEXT,
    "mapLink" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("activityId")
);

-- CreateTable
CREATE TABLE "Stay" (
    "stayId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "name" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "areaSearch" TEXT NOT NULL,
    "country" CHAR(2) NOT NULL,
    "address" TEXT,
    "mapLink" TEXT,
    "checkInDate" DATE NOT NULL,
    "checkOutDate" DATE NOT NULL,

    CONSTRAINT "Stay_pkey" PRIMARY KEY ("stayId")
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "foodItemId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "mealSlots" "MealSlot"[] DEFAULT ARRAY[]::"MealSlot"[],
    "dishName" TEXT NOT NULL,
    "placeName" TEXT,
    "directions" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("foodItemId")
);

-- CreateTable
CREATE TABLE "FoodGuide" (
    "guideId" UUID NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "areaSearch" TEXT NOT NULL,
    "country" CHAR(2) NOT NULL,
    "description" TEXT NOT NULL,
    "language" VARCHAR(8) NOT NULL,
    "isLocal" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'published',
    "heartCount" INTEGER NOT NULL DEFAULT 0,
    "applyCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "FoodGuide_pkey" PRIMARY KEY ("guideId")
);

-- CreateTable
CREATE TABLE "FoodGuideEntry" (
    "entryId" UUID NOT NULL,
    "guideId" UUID NOT NULL,
    "dishName" TEXT NOT NULL,
    "placeName" TEXT NOT NULL,
    "directions" TEXT,
    "mealSlots" "MealSlot"[] DEFAULT ARRAY[]::"MealSlot"[],
    "notes" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FoodGuideEntry_pkey" PRIMARY KEY ("entryId")
);

-- CreateTable
CREATE TABLE "GuideHeart" (
    "guideId" UUID NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideHeart_pkey" PRIMARY KEY ("guideId","accountId")
);

-- CreateTable
CREATE TABLE "GuideReport" (
    "reportId" UUID NOT NULL,
    "guideId" UUID NOT NULL,
    "reason" "GuideReportReason" NOT NULL,
    "reporterAccountId" TEXT,
    "reporterIpHash" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideReport_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "GuideApplication" (
    "guideId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "appliedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideApplication_pkey" PRIMARY KEY ("guideId","planId")
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "itineraryId" UUID NOT NULL,
    "authorId" TEXT NOT NULL,
    "sourcePlanId" VARCHAR(16),
    "title" VARCHAR(50) NOT NULL,
    "destination" TEXT NOT NULL,
    "destinationSearch" TEXT NOT NULL,
    "description" TEXT,
    "language" VARCHAR(8) NOT NULL,
    "theme" TEXT NOT NULL,
    "dayCount" INTEGER NOT NULL,
    "groupSize" INTEGER NOT NULL,
    "estimatedCostPerPerson" DECIMAL(14,3),
    "currency" CHAR(3) NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'published',
    "heartCount" INTEGER NOT NULL DEFAULT 0,
    "copyCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("itineraryId")
);

-- CreateTable
CREATE TABLE "ItineraryActivity" (
    "itemId" UUID NOT NULL,
    "itineraryId" UUID NOT NULL,
    "day" INTEGER NOT NULL,
    "time" VARCHAR(5),
    "name" TEXT NOT NULL,
    "location" TEXT,
    "mapLink" TEXT,
    "notes" TEXT,

    CONSTRAINT "ItineraryActivity_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "ItineraryStay" (
    "itemId" UUID NOT NULL,
    "itineraryId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "areaSearch" TEXT NOT NULL,
    "country" CHAR(2) NOT NULL,
    "address" TEXT,
    "mapLink" TEXT,
    "checkInDay" INTEGER NOT NULL,
    "checkOutDay" INTEGER NOT NULL,

    CONSTRAINT "ItineraryStay_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "ItineraryFood" (
    "itemId" UUID NOT NULL,
    "itineraryId" UUID NOT NULL,
    "dishName" TEXT NOT NULL,
    "placeName" TEXT,
    "directions" TEXT,
    "mealSlots" "MealSlot"[] DEFAULT ARRAY[]::"MealSlot"[],
    "notes" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ItineraryFood_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "ItineraryHeart" (
    "itineraryId" UUID NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItineraryHeart_pkey" PRIMARY KEY ("itineraryId","accountId")
);

-- CreateTable
CREATE TABLE "ItineraryReport" (
    "reportId" UUID NOT NULL,
    "itineraryId" UUID NOT NULL,
    "reason" "ItineraryReportReason" NOT NULL,
    "reporterAccountId" TEXT,
    "reporterIpHash" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItineraryReport_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "ItineraryCopy" (
    "itineraryId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItineraryCopy_pkey" PRIMARY KEY ("itineraryId","planId")
);

-- CreateTable
CREATE TABLE "RecruitPost" (
    "postId" UUID NOT NULL,
    "planId" VARCHAR(16) NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "seatsWanted" INTEGER NOT NULL,
    "seatsTaken" INTEGER NOT NULL DEFAULT 0,
    "costPerPerson" DECIMAL(14,3),
    "description" VARCHAR(1000) NOT NULL,
    "wishes" VARCHAR(500),
    "language" VARCHAR(8) NOT NULL,
    "destinationSearch" TEXT NOT NULL,
    "status" "RecruitPostStatus" NOT NULL DEFAULT 'open',
    "closedReason" "RecruitClosedReason",
    "closedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "RecruitPost_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "JoinRequest" (
    "requestId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "requesterId" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "contactsEnc" BYTEA,
    "contactsPurgedAt" TIMESTAMPTZ(3),
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'pending',
    "role" "GrantedRole",
    "decidedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JoinRequest_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "ContactViewLog" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "accountId" TEXT NOT NULL,
    "viewedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactViewLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruitReport" (
    "reportId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "reason" "RecruitReportReason" NOT NULL,
    "reporterAccountId" TEXT,
    "reporterIpHash" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecruitReport_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "AccountReport" (
    "reportId" UUID NOT NULL,
    "reportedAccountId" TEXT NOT NULL,
    "reporterAccountId" TEXT NOT NULL,
    "reason" "AccountReportReason" NOT NULL,
    "requestId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountReport_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "AccountBlock" (
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountBlock_pkey" PRIMARY KEY ("blockerId","blockedId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_userTag_key" ON "User"("userTag");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicId_key" ON "User"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Verification_identifier_idx" ON "Verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_shareKey_key" ON "Plan"("shareKey");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_ownerParticipantId_key" ON "Plan"("ownerParticipantId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_collectorParticipantId_key" ON "Plan"("collectorParticipantId");

-- CreateIndex
CREATE INDEX "Plan_ownerId_startDate_idx" ON "Plan"("ownerId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "PlanMember_participantId_key" ON "PlanMember"("participantId");

-- CreateIndex
CREATE INDEX "PlanMember_accountId_idx" ON "PlanMember"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanInvite_tokenHash_key" ON "PlanInvite"("tokenHash");

-- CreateIndex
CREATE INDEX "PlanInvite_planId_idx" ON "PlanInvite"("planId");

-- CreateIndex
CREATE INDEX "PlanInvite_participantId_idx" ON "PlanInvite"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailToken_tokenHash_key" ON "EmailToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailToken_planId_idx" ON "EmailToken"("planId");

-- CreateIndex
CREATE INDEX "Participant_planId_createdAt_idx" ON "Participant"("planId", "createdAt");

-- CreateIndex
CREATE INDEX "Contribution_planId_dateTime_idx" ON "Contribution"("planId", "dateTime");

-- CreateIndex
CREATE INDEX "Contribution_participantId_idx" ON "Contribution"("participantId");

-- CreateIndex
CREATE INDEX "Expense_planId_dateTime_idx" ON "Expense"("planId", "dateTime");

-- CreateIndex
CREATE INDEX "Expense_paidByParticipantId_idx" ON "Expense"("paidByParticipantId");

-- CreateIndex
CREATE INDEX "Expense_activityId_idx" ON "Expense"("activityId");

-- CreateIndex
CREATE INDEX "ExpenseShare_participantId_idx" ON "ExpenseShare"("participantId");

-- CreateIndex
CREATE INDEX "Activity_planId_date_time_idx" ON "Activity"("planId", "date", "time");

-- CreateIndex
CREATE INDEX "Stay_planId_checkInDate_idx" ON "Stay"("planId", "checkInDate");

-- CreateIndex
CREATE INDEX "Stay_areaSearch_idx" ON "Stay" USING GIN ("areaSearch" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "FoodItem_planId_order_idx" ON "FoodItem"("planId", "order");

-- CreateIndex
CREATE INDEX "FoodGuide_authorId_idx" ON "FoodGuide"("authorId");

-- CreateIndex
CREATE INDEX "FoodGuide_status_areaSearch_idx" ON "FoodGuide"("status", "areaSearch");

-- CreateIndex
CREATE INDEX "FoodGuide_areaSearch_idx" ON "FoodGuide" USING GIN ("areaSearch" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "FoodGuideEntry_guideId_order_idx" ON "FoodGuideEntry"("guideId", "order");

-- CreateIndex
CREATE INDEX "GuideHeart_accountId_idx" ON "GuideHeart"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "GuideReport_guideId_reporterAccountId_key" ON "GuideReport"("guideId", "reporterAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "GuideReport_guideId_reporterIpHash_key" ON "GuideReport"("guideId", "reporterIpHash");

-- CreateIndex
CREATE INDEX "GuideApplication_planId_idx" ON "GuideApplication"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_sourcePlanId_key" ON "Itinerary"("sourcePlanId");

-- CreateIndex
CREATE INDEX "Itinerary_authorId_idx" ON "Itinerary"("authorId");

-- CreateIndex
CREATE INDEX "Itinerary_status_destinationSearch_idx" ON "Itinerary"("status", "destinationSearch");

-- CreateIndex
CREATE INDEX "Itinerary_destinationSearch_idx" ON "Itinerary" USING GIN ("destinationSearch" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "ItineraryActivity_itineraryId_day_time_idx" ON "ItineraryActivity"("itineraryId", "day", "time");

-- CreateIndex
CREATE INDEX "ItineraryStay_itineraryId_idx" ON "ItineraryStay"("itineraryId");

-- CreateIndex
CREATE INDEX "ItineraryStay_areaSearch_idx" ON "ItineraryStay" USING GIN ("areaSearch" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "ItineraryFood_itineraryId_order_idx" ON "ItineraryFood"("itineraryId", "order");

-- CreateIndex
CREATE INDEX "ItineraryHeart_accountId_idx" ON "ItineraryHeart"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryReport_itineraryId_reporterAccountId_key" ON "ItineraryReport"("itineraryId", "reporterAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryReport_itineraryId_reporterIpHash_key" ON "ItineraryReport"("itineraryId", "reporterIpHash");

-- CreateIndex
CREATE INDEX "ItineraryCopy_planId_idx" ON "ItineraryCopy"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "RecruitPost_planId_key" ON "RecruitPost"("planId");

-- CreateIndex
CREATE INDEX "RecruitPost_status_idx" ON "RecruitPost"("status");

-- CreateIndex
CREATE INDEX "RecruitPost_destinationSearch_idx" ON "RecruitPost" USING GIN ("destinationSearch" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "JoinRequest_postId_status_idx" ON "JoinRequest"("postId", "status");

-- CreateIndex
CREATE INDEX "JoinRequest_requesterId_status_idx" ON "JoinRequest"("requesterId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_postId_requesterId_key" ON "JoinRequest"("postId", "requesterId");

-- CreateIndex
CREATE INDEX "ContactViewLog_requestId_idx" ON "ContactViewLog"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "RecruitReport_postId_reporterAccountId_key" ON "RecruitReport"("postId", "reporterAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "RecruitReport_postId_reporterIpHash_key" ON "RecruitReport"("postId", "reporterIpHash");

-- CreateIndex
CREATE INDEX "AccountReport_reportedAccountId_idx" ON "AccountReport"("reportedAccountId");

-- CreateIndex
CREATE INDEX "AccountBlock_blockedId_idx" ON "AccountBlock"("blockedId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_ownerParticipantId_fkey" FOREIGN KEY ("ownerParticipantId") REFERENCES "Participant"("participantId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_collectorParticipantId_fkey" FOREIGN KEY ("collectorParticipantId") REFERENCES "Participant"("participantId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PlanMember" ADD CONSTRAINT "PlanMember_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanMember" ADD CONSTRAINT "PlanMember_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanMember" ADD CONSTRAINT "PlanMember_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("participantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanInvite" ADD CONSTRAINT "PlanInvite_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanInvite" ADD CONSTRAINT "PlanInvite_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("participantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanInvite" ADD CONSTRAINT "PlanInvite_usedByAccountId_fkey" FOREIGN KEY ("usedByAccountId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailToken" ADD CONSTRAINT "EmailToken_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("participantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentQr" ADD CONSTRAINT "PaymentQr_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_paidByParticipantId_fkey" FOREIGN KEY ("paidByParticipantId") REFERENCES "Participant"("participantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("activityId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseShare" ADD CONSTRAINT "ExpenseShare_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("expenseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseShare" ADD CONSTRAINT "ExpenseShare_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("participantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stay" ADD CONSTRAINT "Stay_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodGuide" ADD CONSTRAINT "FoodGuide_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodGuideEntry" ADD CONSTRAINT "FoodGuideEntry_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "FoodGuide"("guideId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideHeart" ADD CONSTRAINT "GuideHeart_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "FoodGuide"("guideId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideHeart" ADD CONSTRAINT "GuideHeart_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideReport" ADD CONSTRAINT "GuideReport_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "FoodGuide"("guideId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideReport" ADD CONSTRAINT "GuideReport_reporterAccountId_fkey" FOREIGN KEY ("reporterAccountId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideApplication" ADD CONSTRAINT "GuideApplication_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "FoodGuide"("guideId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideApplication" ADD CONSTRAINT "GuideApplication_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_sourcePlanId_fkey" FOREIGN KEY ("sourcePlanId") REFERENCES "Plan"("planId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryActivity" ADD CONSTRAINT "ItineraryActivity_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("itineraryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryStay" ADD CONSTRAINT "ItineraryStay_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("itineraryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryFood" ADD CONSTRAINT "ItineraryFood_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("itineraryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryHeart" ADD CONSTRAINT "ItineraryHeart_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("itineraryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryHeart" ADD CONSTRAINT "ItineraryHeart_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryReport" ADD CONSTRAINT "ItineraryReport_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("itineraryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryReport" ADD CONSTRAINT "ItineraryReport_reporterAccountId_fkey" FOREIGN KEY ("reporterAccountId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryCopy" ADD CONSTRAINT "ItineraryCopy_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("itineraryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryCopy" ADD CONSTRAINT "ItineraryCopy_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitPost" ADD CONSTRAINT "RecruitPost_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_postId_fkey" FOREIGN KEY ("postId") REFERENCES "RecruitPost"("postId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactViewLog" ADD CONSTRAINT "ContactViewLog_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "JoinRequest"("requestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactViewLog" ADD CONSTRAINT "ContactViewLog_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitReport" ADD CONSTRAINT "RecruitReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "RecruitPost"("postId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitReport" ADD CONSTRAINT "RecruitReport_reporterAccountId_fkey" FOREIGN KEY ("reporterAccountId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountReport" ADD CONSTRAINT "AccountReport_reportedAccountId_fkey" FOREIGN KEY ("reportedAccountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountReport" ADD CONSTRAINT "AccountReport_reporterAccountId_fkey" FOREIGN KEY ("reporterAccountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountReport" ADD CONSTRAINT "AccountReport_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "JoinRequest"("requestId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountBlock" ADD CONSTRAINT "AccountBlock_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountBlock" ADD CONSTRAINT "AccountBlock_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Hand-written: rules Prisma can't express. Prisma does not diff CHECK constraints
-- or triggers, so later migrations keep them.
-- ---------------------------------------------------------------------------

-- Plan kinds (R2, R93, R94): basic plans have no dates, location, theme or cover;
-- detailed plans have dates and last at most 60 days, both ends included.
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_kind_fields_check" CHECK (
  ("kind" = 'basic'
    AND "startDate" IS NULL AND "endDate" IS NULL AND "location" IS NULL
    AND "theme" IS NULL AND "coverImagePath" IS NULL
    AND ("notes" IS NULL OR char_length("notes") <= 100))
  OR ("kind" = 'detailed'
    AND "startDate" IS NOT NULL AND "endDate" IS NOT NULL
    AND "endDate" >= "startDate" AND "endDate" <= "startDate" + 59)
);
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_planId_digits_check" CHECK ("planId" ~ '^[0-9]{10,16}$');
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$');
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_passcode_counters_check" CHECK ("passcodeVersion" >= 1 AND "failedPasscodeAttempts" >= 0);

-- Membership: the owner row is the one created with the plan (R84).
ALTER TABLE "PlanMember" ADD CONSTRAINT "PlanMember_owner_created_check" CHECK (("role" = 'owner') = ("joinedVia" = 'created'));

-- Money (R14, R16, R18).
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_amount_check" CHECK ("amount" > 0);
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_amount_check" CHECK ("amount" > 0);
ALTER TABLE "ExpenseShare" ADD CONSTRAINT "ExpenseShare_ratio_check" CHECK ("ratio" > 0);

-- Schedule and stays (R31, R60, R64).
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_time_check" CHECK ("time" IS NULL OR "time" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');
ALTER TABLE "Stay" ADD CONSTRAINT "Stay_dates_check" CHECK ("checkOutDate" > "checkInDate");
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_counts_check" CHECK ("dayCount" BETWEEN 1 AND 60 AND "groupSize" >= 1 AND "heartCount" >= 0 AND "copyCount" >= 0);
ALTER TABLE "ItineraryActivity" ADD CONSTRAINT "ItineraryActivity_day_check" CHECK ("day" >= 1);
ALTER TABLE "ItineraryActivity" ADD CONSTRAINT "ItineraryActivity_time_check" CHECK ("time" IS NULL OR "time" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');
ALTER TABLE "ItineraryStay" ADD CONSTRAINT "ItineraryStay_days_check" CHECK ("checkInDay" >= 1 AND "checkOutDay" > "checkInDay");
ALTER TABLE "FoodGuide" ADD CONSTRAINT "FoodGuide_counts_check" CHECK ("heartCount" >= 0 AND "applyCount" >= 0);

-- Recruiting (R86, R88, R92).
ALTER TABLE "RecruitPost" ADD CONSTRAINT "RecruitPost_seats_check" CHECK ("seatsWanted" BETWEEN 1 AND 20 AND "seatsTaken" BETWEEN 0 AND "seatsWanted");
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_partySize_check" CHECK ("partySize" >= 1);
ALTER TABLE "AccountBlock" ADD CONSTRAINT "AccountBlock_not_self_check" CHECK ("blockerId" <> "blockedId");
ALTER TABLE "AccountReport" ADD CONSTRAINT "AccountReport_not_self_check" CHECK ("reportedAccountId" <> "reporterAccountId");

-- R13: a participant with expenses, shares or contributions, or who is the plan's owner or
-- collector, is marked inactive instead of deleted. Their foreign keys cascade so deleting a
-- whole plan works in any order; this guard only applies while the plan still exists.
CREATE FUNCTION "guard_participant_delete"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Plan" WHERE "planId" = OLD."planId") AND (
       EXISTS (SELECT 1 FROM "Expense" WHERE "paidByParticipantId" = OLD."participantId")
    OR EXISTS (SELECT 1 FROM "ExpenseShare" WHERE "participantId" = OLD."participantId")
    OR EXISTS (SELECT 1 FROM "Contribution" WHERE "participantId" = OLD."participantId")
    OR EXISTS (SELECT 1 FROM "Plan" WHERE "ownerParticipantId" = OLD."participantId" OR "collectorParticipantId" = OLD."participantId")
  ) THEN
    RAISE EXCEPTION 'participant % is still used by the plan; mark it inactive instead (R13)', OLD."participantId"
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER "Participant_guard_delete" BEFORE DELETE ON "Participant" FOR EACH ROW EXECUTE FUNCTION "guard_participant_delete"();

-- Plan.updatedAt follows every change to the plan's visible data, so other devices can
-- tell the plan changed (tasks 3, 12). Access rows (members, invites, tokens) don't count.
CREATE FUNCTION "touch_plan_updated_at"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  plan_id varchar(16);
BEGIN
  IF TG_OP = 'DELETE' THEN
    plan_id := OLD."planId";
  ELSE
    plan_id := NEW."planId";
  END IF;
  UPDATE "Plan" SET "updatedAt" = now() WHERE "planId" = plan_id;
  RETURN NULL;
END;
$$;

CREATE FUNCTION "touch_plan_updated_at_from_expense"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  expense_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    expense_id := OLD."expenseId";
  ELSE
    expense_id := NEW."expenseId";
  END IF;
  UPDATE "Plan" SET "updatedAt" = now()
  FROM "Expense"
  WHERE "Expense"."expenseId" = expense_id AND "Plan"."planId" = "Expense"."planId";
  RETURN NULL;
END;
$$;

CREATE TRIGGER "Participant_touch_plan" AFTER INSERT OR UPDATE OR DELETE ON "Participant" FOR EACH ROW EXECUTE FUNCTION "touch_plan_updated_at"();
CREATE TRIGGER "Contribution_touch_plan" AFTER INSERT OR UPDATE OR DELETE ON "Contribution" FOR EACH ROW EXECUTE FUNCTION "touch_plan_updated_at"();
CREATE TRIGGER "PaymentQr_touch_plan" AFTER INSERT OR UPDATE OR DELETE ON "PaymentQr" FOR EACH ROW EXECUTE FUNCTION "touch_plan_updated_at"();
CREATE TRIGGER "Expense_touch_plan" AFTER INSERT OR UPDATE OR DELETE ON "Expense" FOR EACH ROW EXECUTE FUNCTION "touch_plan_updated_at"();
CREATE TRIGGER "ExpenseShare_touch_plan" AFTER INSERT OR UPDATE OR DELETE ON "ExpenseShare" FOR EACH ROW EXECUTE FUNCTION "touch_plan_updated_at_from_expense"();
CREATE TRIGGER "Activity_touch_plan" AFTER INSERT OR UPDATE OR DELETE ON "Activity" FOR EACH ROW EXECUTE FUNCTION "touch_plan_updated_at"();
CREATE TRIGGER "Stay_touch_plan" AFTER INSERT OR UPDATE OR DELETE ON "Stay" FOR EACH ROW EXECUTE FUNCTION "touch_plan_updated_at"();
CREATE TRIGGER "FoodItem_touch_plan" AFTER INSERT OR UPDATE OR DELETE ON "FoodItem" FOR EACH ROW EXECUTE FUNCTION "touch_plan_updated_at"();
