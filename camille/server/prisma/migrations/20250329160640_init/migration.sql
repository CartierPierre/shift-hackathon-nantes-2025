-- CreateTable
CREATE TABLE "Resume" (
    "id" SERIAL NOT NULL,
    "sentence" TEXT NOT NULL,
    "updateAt" TIMESTAMP(3),
    "createAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speaker" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trouble" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "definition" TEXT NOT NULL,

    CONSTRAINT "Trouble_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "lastname" VARCHAR(50),
    "birthDate" TIMESTAMP(3),
    "culture" VARCHAR(254),
    "follow" BOOLEAN NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pathology" (
    "id" SERIAL NOT NULL,
    "selfDiagnosis" BOOLEAN NOT NULL,
    "proDiagnosis" BOOLEAN NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pathology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Have" (
    "profileId" INTEGER NOT NULL,
    "pathologyId" INTEGER NOT NULL,

    CONSTRAINT "Have_pkey" PRIMARY KEY ("profileId","pathologyId")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "sentence" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL,
    "updateAt" TIMESTAMP(3),
    "speakerId" INTEGER NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" SERIAL NOT NULL,
    "sentence" TEXT NOT NULL,
    "mood" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL,
    "conversationId" INTEGER NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Substance" (
    "id" SERIAL NOT NULL,
    "recreative" BOOLEAN NOT NULL,
    "medicine" BOOLEAN NOT NULL,
    "substance" VARCHAR(50),

    CONSTRAINT "Substance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consume" (
    "analysisId" INTEGER NOT NULL,
    "substanceId" INTEGER NOT NULL,

    CONSTRAINT "Consume_pkey" PRIMARY KEY ("analysisId","substanceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_conversationId_key" ON "Analysis"("conversationId");

-- AddForeignKey
ALTER TABLE "Have" ADD CONSTRAINT "Have_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Have" ADD CONSTRAINT "Have_pathologyId_fkey" FOREIGN KEY ("pathologyId") REFERENCES "Pathology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consume" ADD CONSTRAINT "Consume_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consume" ADD CONSTRAINT "Consume_substanceId_fkey" FOREIGN KEY ("substanceId") REFERENCES "Substance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "Speaker" ("name") VALUES ('AI');
INSERT INTO "Speaker" ("name") VALUES ('user');