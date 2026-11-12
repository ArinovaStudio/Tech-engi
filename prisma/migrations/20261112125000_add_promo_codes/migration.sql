ALTER TABLE "Transaction"
ADD COLUMN "promoCodeId" TEXT,
ADD COLUMN "promoPercentage" INTEGER,
ADD COLUMN "promoDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "payuFirstName" TEXT;

CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PromoCodeRedemption" (
    "id" TEXT NOT NULL,
    "promoCodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoCodeRedemption_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");
CREATE UNIQUE INDEX "PromoCodeRedemption_transactionId_key"
ON "PromoCodeRedemption"("transactionId");
CREATE UNIQUE INDEX "PromoCodeRedemption_promoCodeId_userId_key"
ON "PromoCodeRedemption"("promoCodeId", "userId");
CREATE UNIQUE INDEX "Transaction_pending_promo_user_key"
ON "Transaction"("userId")
WHERE "promoCodeId" IS NOT NULL AND "status" = 'PENDING';

ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_promoCodeId_fkey"
FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PromoCode"
ADD CONSTRAINT "PromoCode_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PromoCodeRedemption"
ADD CONSTRAINT "PromoCodeRedemption_promoCodeId_fkey"
FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PromoCodeRedemption"
ADD CONSTRAINT "PromoCodeRedemption_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PromoCodeRedemption"
ADD CONSTRAINT "PromoCodeRedemption_transactionId_fkey"
FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
