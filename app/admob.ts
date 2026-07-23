import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  type AdMobRewardItem,
  RewardAdPluginEvents,
} from "@capacitor-community/admob";

const TEST_REWARDED_IDS = {
  android: "ca-app-pub-3940256099942544/5224354917",
  ios: "ca-app-pub-3940256099942544/1712485313",
} as const;

let initialization: Promise<void> | null = null;

export type RewardedAdResult =
  | { status: "rewarded"; reward: AdMobRewardItem }
  | { status: "dismissed" }
  | { status: "web" };

function rewardedAdId(platform: "android" | "ios") {
  const env = (import.meta as ImportMeta & {
    env: Record<string, string | undefined>;
  }).env;
  const configured =
    platform === "android"
      ? env.VITE_ADMOB_REWARDED_ANDROID
      : env.VITE_ADMOB_REWARDED_IOS;
  return configured || TEST_REWARDED_IDS[platform];
}

async function initializeAdMob() {
  initialization ??= (async () => {
    await AdMob.initialize({ initializeForTesting: true });
    const consent = await AdMob.requestConsentInfo();
    if (!consent.canRequestAds && consent.isConsentFormAvailable) {
      await AdMob.showConsentForm();
    }
  })();
  return initialization;
}

export function isNativeAdMobAvailable() {
  const platform = Capacitor.getPlatform();
  return Capacitor.isNativePlatform() && (platform === "android" || platform === "ios");
}

export async function showRewardedHeartAd(): Promise<RewardedAdResult> {
  if (!isNativeAdMobAvailable()) return { status: "web" };

  const platform = Capacitor.getPlatform() as "android" | "ios";
  await initializeAdMob();

  let earnedReward: AdMobRewardItem | null = null;
  const rewardedListener = await AdMob.addListener(
    RewardAdPluginEvents.Rewarded,
    (reward) => {
      earnedReward = reward;
    },
  );

  try {
    await AdMob.prepareRewardVideoAd({
      adId: rewardedAdId(platform),
      isTesting: true,
      immersiveMode: true,
      npa: true,
    });
    const returnedReward = await AdMob.showRewardVideoAd();
    const reward = earnedReward ?? returnedReward;
    return reward ? { status: "rewarded", reward } : { status: "dismissed" };
  } catch {
    if (earnedReward) return { status: "rewarded", reward: earnedReward };
    return { status: "dismissed" };
  } finally {
    await rewardedListener.remove();
  }
}
