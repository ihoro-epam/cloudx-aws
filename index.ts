import {SiteServingInstance} from "./resources/SiteServingInstance";

const instance = new SiteServingInstance('site-serving-instance');

export const websiteUrl = instance.publicIp;
export const sourceBucketDomain = instance.siteBucketDomain;
