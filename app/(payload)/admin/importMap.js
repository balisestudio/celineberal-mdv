import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from "@payloadcms/next/rsc";
import {
	BlockquoteFeatureClient as BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	BlocksFeatureClient as BlocksFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	BoldFeatureClient as BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	HeadingFeatureClient as HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	InlineCodeFeatureClient as InlineCodeFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	InlineToolbarFeatureClient as InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	ItalicFeatureClient as ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	LinkFeatureClient as LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	ParagraphFeatureClient as ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	StrikethroughFeatureClient as StrikethroughFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	SubscriptFeatureClient as SubscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	SuperscriptFeatureClient as SuperscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	UnderlineFeatureClient as UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	UploadFeatureClient as UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
} from "@payloadcms/richtext-lexical/client";
import {
	LexicalDiffComponent as LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
	RscEntryLexicalCell as RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
	RscEntryLexicalField as RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
} from "@payloadcms/richtext-lexical/rsc";
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from "@payloadcms/storage-s3/client";
import { Avatar as Avatar_8501e0134e041fe529df17c38dc04676 } from "../../../components/payload/avatar";
import { ImportsLots as ImportsLots_148b40f15d4b80691e3177847c4a7ed0 } from "../../../components/payload/imports-lots";

export const importMap = {
	"/components/payload/imports-lots#ImportsLots":
		ImportsLots_148b40f15d4b80691e3177847c4a7ed0,
	"@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell":
		RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
	"@payloadcms/richtext-lexical/rsc#RscEntryLexicalField":
		RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
	"@payloadcms/richtext-lexical/rsc#LexicalDiffComponent":
		LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
	"@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient":
		InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#LinkFeatureClient":
		LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#InlineCodeFeatureClient":
		InlineCodeFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#SuperscriptFeatureClient":
		SuperscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#SubscriptFeatureClient":
		SubscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#StrikethroughFeatureClient":
		StrikethroughFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#UnderlineFeatureClient":
		UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#BoldFeatureClient":
		BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#ItalicFeatureClient":
		ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#BlocksFeatureClient":
		BlocksFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient":
		HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#UploadFeatureClient":
		UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#BlockquoteFeatureClient":
		BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#HeadingFeatureClient":
		HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"@payloadcms/richtext-lexical/client#ParagraphFeatureClient":
		ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
	"/components/payload/avatar#Avatar": Avatar_8501e0134e041fe529df17c38dc04676,
	"@payloadcms/storage-s3/client#S3ClientUploadHandler":
		S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
	"@payloadcms/next/rsc#CollectionCards":
		CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1,
};
