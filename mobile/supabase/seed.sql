SET session_replication_role = replica;
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" (
		"instance_id",
		"id",
		"payload",
		"created_at",
		"ip_address"
	)
VALUES (
		'00000000-0000-0000-0000-000000000000',
		'e499ed44-49a0-46d5-b817-4985bde5ac57',
		'{"action":"user_signedup","actor_id":"b0d0bf5d-b393-41e5-b229-39e34107929e","actor_username":"test@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}',
		'2024-12-03 19:51:42.250564+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'cdc3f129-ff5a-41ce-9103-21702ad98030',
		'{"action":"login","actor_id":"b0d0bf5d-b393-41e5-b229-39e34107929e","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}',
		'2024-12-03 19:51:42.254194+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'623bb9f2-efca-427d-9bae-6608b6e4c5dd',
		'{"action":"user_signedup","actor_id":"e36896eb-7f8f-4298-b10b-cff565236eeb","actor_username":"test@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}',
		'2024-12-03 20:52:37.727237+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'1d1e06b4-6747-4d45-9d06-574ada624f97',
		'{"action":"login","actor_id":"e36896eb-7f8f-4298-b10b-cff565236eeb","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}',
		'2024-12-03 20:52:37.728786+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'abff98ca-a1a9-4731-a09d-e958b045aaed',
		'{"action":"logout","actor_id":"e36896eb-7f8f-4298-b10b-cff565236eeb","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account"}',
		'2024-12-03 20:52:45.784959+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'5b9f963e-5314-4d17-bd54-737e20465ffd',
		'{"action":"login","actor_id":"e36896eb-7f8f-4298-b10b-cff565236eeb","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}',
		'2024-12-03 20:52:57.256641+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'9ac2ba4d-028f-4fe9-9134-9b4dcbaa57f4',
		'{"action":"logout","actor_id":"e36896eb-7f8f-4298-b10b-cff565236eeb","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account"}',
		'2024-12-03 20:53:58.371279+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'2e38fd84-7c55-4101-9300-97dc6645f122',
		'{"action":"user_signedup","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}',
		'2024-12-03 20:54:13.087519+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'ea773560-c964-42d9-97a7-fab8e7c2ea4c',
		'{"action":"login","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}',
		'2024-12-03 20:54:13.089626+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'93ee0843-be85-4798-9c76-9208c7109b21',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-03 21:52:34.25878+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'b738c676-9542-4088-b75b-a77feddc539e',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-03 21:52:34.259395+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'9222658c-e68f-4433-b31b-3a6dd84d9e76',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-03 22:50:34.597933+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'e0326042-9e2a-48eb-9c83-f770b400f137',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-03 22:50:34.598602+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'ea8ae7cf-2d78-4ab7-9e45-ab01079bb8d7',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-03 23:48:35.307716+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'27d32701-de60-4380-8391-09e7451fa79d',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-03 23:48:35.309036+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'94489124-392c-4cf8-a3ab-61b6bbf9c34a',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 00:46:35.537847+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'c62ddde0-b058-426c-a8a4-be825d4a2700',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 00:46:35.539201+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'a7493183-537d-49a9-b0ea-7ca48bc28c6c',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 01:44:40.161087+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'70dddd6c-55c9-4b0f-b808-c7e2b8e77ce4',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 01:44:40.162375+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'69e84c26-8eb1-4fe3-bd4c-14ff64578a28',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 02:42:40.421068+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'9c19224d-0fd2-4b78-aedf-e7b22cea154b',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 02:42:40.422287+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'1934d686-0690-4efc-bd6a-e3375e867908',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 03:40:40.665087+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'494819a3-20f4-44be-8ca2-ecf94d79256f',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 03:40:40.666515+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'65ea8ad4-7e2f-4a1e-a141-654d07a108b3',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 04:38:40.868988+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'93d936f2-1ef4-4ba8-b60e-1b5cc671fcf0',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 04:38:40.870624+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'ca5102db-b9d0-4aec-967a-cff070ee1e3b',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 05:36:41.118854+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'43adb65a-506e-43d8-aa6b-1d1ccc5f3cbc',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 05:36:41.119613+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'18628d42-c1e6-492a-b326-bbca910a450f',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 06:34:41.366082+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'824a8429-286d-4cef-98b3-93844afd2ccb',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 06:34:41.367372+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'f073755c-f600-4d0a-a688-a1aa273eae96',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 07:32:41.566894+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'2add9007-825e-47ed-8143-343cd36be731',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 07:32:41.56847+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'1980dc76-34e6-4473-ba58-a819508fb3a3',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 08:30:41.762827+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'1d0bc4a1-d30a-47b7-acb8-70b14968d053',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 08:30:41.763574+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'f9b09683-17b6-4858-a25e-6a1f5c1ccd7d',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 09:28:44.195252+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'd9a7977b-b924-4317-8163-8086b100be12',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 09:28:44.197426+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'4d313f78-dad9-45e5-8d0c-e143c6eb060e',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 10:26:44.481563+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'4ef75fb4-f1a5-466f-ad05-14599b0035b0',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 10:26:44.482958+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'534b56f9-ed65-4a69-a7ff-7c60b9cfa761',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 11:24:44.716786+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'dee1ee23-e9eb-4d70-9154-33c3fd7ac4ac',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 11:24:44.718198+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'9179e23c-2635-4672-9aa7-9e738b44c5c5',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 12:22:44.957618+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'53c68db6-d444-40ae-8394-d27863aa84ba',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 12:22:44.95861+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'9a3f5ea5-060f-422c-b7b5-69255a04684b',
		'{"action":"logout","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"account"}',
		'2024-12-04 13:17:36.985365+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'd7129ee2-8c6e-4dd4-8797-b3f4fe6aa4f2',
		'{"action":"login","actor_id":"e36896eb-7f8f-4298-b10b-cff565236eeb","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}',
		'2024-12-04 13:17:51.399868+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'464a3c1b-15cb-4b6e-a832-018924f427f2',
		'{"action":"logout","actor_id":"e36896eb-7f8f-4298-b10b-cff565236eeb","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account"}',
		'2024-12-04 13:18:06.430634+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'7f84f977-3e4c-4549-9fe7-0eead8b8aedd',
		'{"action":"login","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}',
		'2024-12-04 13:18:17.894137+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'8b3b2b2f-adcf-4b41-b446-005a05145a21',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 14:16:44.611757+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'6eb92bee-e24c-4fb4-881a-7ee58d7c027b',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 14:16:44.612791+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'c494057e-3d15-4bc5-af30-adfb687fe299',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 15:14:44.844473+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'c6099e96-2543-468d-8f65-7522cbdb976e',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 15:14:44.845513+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'dd28dcad-93b7-46f3-8312-5fb533ec12f3',
		'{"action":"token_refreshed","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 16:12:50.337821+00',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'1a19f0a9-e8c9-45ed-815f-33084852a02b',
		'{"action":"token_revoked","actor_id":"2b419da8-0f38-4013-8501-c2d7ee0ad18a","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"token"}',
		'2024-12-04 16:12:50.339295+00',
		''
	);
--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" (
		"instance_id",
		"id",
		"aud",
		"role",
		"email",
		"encrypted_password",
		"email_confirmed_at",
		"invited_at",
		"confirmation_token",
		"confirmation_sent_at",
		"recovery_token",
		"recovery_sent_at",
		"email_change_token_new",
		"email_change",
		"email_change_sent_at",
		"last_sign_in_at",
		"raw_app_meta_data",
		"raw_user_meta_data",
		"is_super_admin",
		"created_at",
		"updated_at",
		"phone",
		"phone_confirmed_at",
		"phone_change",
		"phone_change_token",
		"phone_change_sent_at",
		"email_change_token_current",
		"email_change_confirm_status",
		"banned_until",
		"reauthentication_token",
		"reauthentication_sent_at",
		"is_sso_user",
		"deleted_at",
		"is_anonymous"
	)
VALUES (
		'00000000-0000-0000-0000-000000000000',
		'e36896eb-7f8f-4298-b10b-cff565236eeb',
		'authenticated',
		'authenticated',
		'test@test.com',
		'$2a$10$UbswKr7RoPZHcv3GOJ9VyemsnVul//yAZHLdbKUjV8VYTFr.mbrUO',
		'2024-12-03 20:52:37.72766+00',
		NULL,
		'',
		NULL,
		'',
		NULL,
		'',
		'',
		NULL,
		'2024-12-04 13:17:51.400706+00',
		'{"provider": "email", "providers": ["email"]}',
		'{"sub": "e36896eb-7f8f-4298-b10b-cff565236eeb", "email": "test@test.com", "email_verified": false, "phone_verified": false}',
		NULL,
		'2024-12-03 20:52:37.721769+00',
		'2024-12-04 13:17:51.403066+00',
		NULL,
		NULL,
		'',
		'',
		NULL,
		'',
		0,
		NULL,
		'',
		NULL,
		false,
		NULL,
		false
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'2b419da8-0f38-4013-8501-c2d7ee0ad18a',
		'authenticated',
		'authenticated',
		'test2@test.com',
		'$2a$10$30YabBw8amGP3Fx8A/kOUuwesY8JChwsVkt2/k.z8iCBGMbI9T/LK',
		'2024-12-03 20:54:13.08795+00',
		NULL,
		'',
		NULL,
		'',
		NULL,
		'',
		'',
		NULL,
		'2024-12-04 13:18:17.894793+00',
		'{"provider": "email", "providers": ["email"]}',
		'{"sub": "2b419da8-0f38-4013-8501-c2d7ee0ad18a", "email": "test2@test.com", "email_verified": false, "phone_verified": false}',
		NULL,
		'2024-12-03 20:54:13.083463+00',
		'2024-12-04 16:12:50.342357+00',
		NULL,
		NULL,
		'',
		'',
		NULL,
		'',
		0,
		NULL,
		'',
		NULL,
		false,
		NULL,
		false
	);
--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" (
		"provider_id",
		"user_id",
		"identity_data",
		"provider",
		"last_sign_in_at",
		"created_at",
		"updated_at",
		"id"
	)
VALUES (
		'e36896eb-7f8f-4298-b10b-cff565236eeb',
		'e36896eb-7f8f-4298-b10b-cff565236eeb',
		'{"sub": "e36896eb-7f8f-4298-b10b-cff565236eeb", "email": "test@test.com", "email_verified": false, "phone_verified": false}',
		'email',
		'2024-12-03 20:52:37.72577+00',
		'2024-12-03 20:52:37.725799+00',
		'2024-12-03 20:52:37.725799+00',
		'de5181c1-0452-4af6-854b-f97037cc4c4f'
	),
	(
		'2b419da8-0f38-4013-8501-c2d7ee0ad18a',
		'2b419da8-0f38-4013-8501-c2d7ee0ad18a',
		'{"sub": "2b419da8-0f38-4013-8501-c2d7ee0ad18a", "email": "test2@test.com", "email_verified": false, "phone_verified": false}',
		'email',
		'2024-12-03 20:54:13.086085+00',
		'2024-12-03 20:54:13.086116+00',
		'2024-12-03 20:54:13.086116+00',
		'09e1bfd3-dfc7-4d07-a59d-76827612c6e4'
	);
--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" (
		"id",
		"user_id",
		"created_at",
		"updated_at",
		"factor_id",
		"aal",
		"not_after",
		"refreshed_at",
		"user_agent",
		"ip",
		"tag"
	)
VALUES (
		'50eafdd9-25f0-4475-adc3-55b049102e73',
		'2b419da8-0f38-4013-8501-c2d7ee0ad18a',
		'2024-12-04 13:18:17.894841+00',
		'2024-12-04 16:12:50.343844+00',
		NULL,
		'aal1',
		NULL,
		'2024-12-04 16:12:50.343792',
		'diyguide/1 CFNetwork/1490.0.4 Darwin/24.1.0',
		'172.18.0.1',
		NULL
	);
--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" (
		"session_id",
		"created_at",
		"updated_at",
		"authentication_method",
		"id"
	)
VALUES (
		'50eafdd9-25f0-4475-adc3-55b049102e73',
		'2024-12-04 13:18:17.896373+00',
		'2024-12-04 13:18:17.896373+00',
		'password',
		'2d3a375f-0f9f-4c31-ba36-e449a1c4fd4e'
	);
--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" (
		"instance_id",
		"id",
		"token",
		"user_id",
		"revoked",
		"created_at",
		"updated_at",
		"parent",
		"session_id"
	)
VALUES (
		'00000000-0000-0000-0000-000000000000',
		22,
		'9uaQTrsKEeTZjqpC_4w0Ow',
		'2b419da8-0f38-4013-8501-c2d7ee0ad18a',
		true,
		'2024-12-04 13:18:17.895481+00',
		'2024-12-04 14:16:44.613334+00',
		NULL,
		'50eafdd9-25f0-4475-adc3-55b049102e73'
	),
	(
		'00000000-0000-0000-0000-000000000000',
		23,
		'euTzAYqVcidIG7JPD9br0g',
		'2b419da8-0f38-4013-8501-c2d7ee0ad18a',
		true,
		'2024-12-04 14:16:44.6142+00',
		'2024-12-04 15:14:44.845973+00',
		'9uaQTrsKEeTZjqpC_4w0Ow',
		'50eafdd9-25f0-4475-adc3-55b049102e73'
	),
	(
		'00000000-0000-0000-0000-000000000000',
		24,
		'4sFhZ6v0UFzzWx-2Qom_Qg',
		'2b419da8-0f38-4013-8501-c2d7ee0ad18a',
		true,
		'2024-12-04 15:14:44.84675+00',
		'2024-12-04 16:12:50.33974+00',
		'euTzAYqVcidIG7JPD9br0g',
		'50eafdd9-25f0-4475-adc3-55b049102e73'
	),
	(
		'00000000-0000-0000-0000-000000000000',
		25,
		'n4VMr7wrMaFKN_CR9zvR9w',
		'2b419da8-0f38-4013-8501-c2d7ee0ad18a',
		false,
		'2024-12-04 16:12:50.340894+00',
		'2024-12-04 16:12:50.340894+00',
		'4sFhZ6v0UFzzWx-2Qom_Qg',
		'50eafdd9-25f0-4475-adc3-55b049102e73'
	);
--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

--
-- Data for Name: guides; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."guides" (
		"id",
		"title",
		"content",
		"created_by",
		"created_at",
		"steps",
		"tips",
		"materials",
		"tools"
	)
VALUES (
		'd32435bf-d91c-45d6-ae25-b3f65a39a322',
		'How to Make Homemade Pasta from Scratch',
		'Making pasta from scratch is a rewarding and delicious experience. You can create your own pasta using just a few simple ingredients and tools, resulting in fresh and flavorful pasta that you can be proud of.',
		'AI',
		'2024-11-27 22:59:08.250848',
		'{"{\"step\": 1, \"tools\": [\"Measuring cups\", \"Mixing bowl\"], \"materials\": [\"2 cups of all-purpose flour (240 grams)\", \"3 large eggs\", \"1 teaspoon of salt (optional)\"], \"description\": \"Gather and measure your ingredients.\"}","{\"step\": 2, \"tools\": [\"Clean flat surface (e.g., kitchen counter or large cutting board)\"], \"materials\": [], \"description\": \"Make a well in the center of the flour.\"}","{\"step\": 3, \"tools\": [\"Fork\", \"Pastry scraper (optional)\"], \"materials\": [], \"description\": \"Crack the eggs into the well and gently beat them with a fork, gradually incorporating the flour until a dough forms.\"}","{\"step\": 4, \"tools\": [\"Your hands\"], \"materials\": [], \"description\": \"Knead the dough until smooth and elastic, about 8-10 minutes. If the dough is sticky, add a little flour as needed.\"}","{\"step\": 5, \"tools\": [], \"materials\": [\"Plastic wrap\"], \"description\": \"Wrap the dough in plastic wrap and let it rest for at least 30 minutes at room temperature.\"}","{\"step\": 6, \"tools\": [\"Pasta machine or rolling pin\"], \"materials\": [], \"description\": \"Divide the dough into four pieces and roll each piece into a flat sheet using a pasta machine or rolling pin, until it reaches the desired thickness.\"}","{\"step\": 7, \"tools\": [\"Sharp knife or pasta cutter\"], \"materials\": [], \"description\": \"Cut the pasta sheet into the desired shape, such as fettuccine or tagliatelle.\"}","{\"step\": 8, \"tools\": [], \"materials\": [\"Extra flour for dusting\"], \"description\": \"Dust the cut pasta with flour to prevent it from sticking. Let it dry slightly before cooking.\"}"}',
		'{"Use semolina flour instead of all-purpose flour for a more traditional pasta texture.","If you don''t have a pasta machine, use a rolling pin and cut the dough by hand to achieve the desired thickness.","To add flavor, incorporate herbs or spices like basil, oregano, or garlic powder into the dough.","Ensure the dough is not too dry before kneading; adjust with water or flour as necessary.","Always let the dough rest before rolling it out, as this relaxes the gluten and makes it easier to handle."}',
		'{"2 cups of all-purpose flour (240 grams)","3 large eggs","1 teaspoon of salt","Plastic wrap","Extra flour for dusting"}',
		'{"Measuring cups","Mixing bowl","Clean flat surface",Fork,"Pastry scraper","Pasta machine or rolling pin","Sharp knife or pasta cutter"}'
	),
	(
		'9af6b252-2c2c-40f0-99e9-ab6da367eb88',
		'How to Make Homemade Pasta from Scratch',
		'Making homemade pasta from scratch is not only rewarding but incredibly delicious. This guide will walk you through the process of crafting traditional Italian pasta using simple ingredients and basic tools. You''ll learn everything you need to create your pasta, from mixing the dough to cutting it into your desired shapes.',
		'AI',
		'2024-11-28 13:41:50.567708',
		'{"{\"step\": 1, \"tools\": [\"Clean, flat surface or large wooden board\", \"Small bowl of extra flour for dusting\"], \"materials\": [], \"description\": \"Prepare your workspace.\"}","{\"step\": 2, \"tools\": [\"Fork\"], \"materials\": [\"400g (3 1/3 cups) all-purpose flour\", \"1/2 tsp salt\"], \"description\": \"Combine the flour and salt in a mound on your work surface. Create a well in the center.\"}","{\"step\": 3, \"tools\": [\"Fork\", \"Measuring cup\"], \"materials\": [\"4 large eggs\"], \"description\": \"Beat the eggs, then pour them into the well. Gradually mix the flour into the eggs using a fork.\"}","{\"step\": 4, \"tools\": [\"Hands\"], \"materials\": [\"Extra flour for dusting (as needed)\"], \"description\": \"Knead the dough until smooth and elastic, about 8-10 minutes. If the dough is too sticky, dust with more flour as needed.\"}","{\"step\": 5, \"tools\": [], \"materials\": [\"Plastic wrap\"], \"description\": \"Wrap the dough in plastic wrap and let it rest for at least 30 minutes at room temperature to allow the gluten to relax.\"}","{\"step\": 6, \"tools\": [\"Pasta machine or rolling pin\"], \"materials\": [], \"description\": \"Divide the dough into four pieces. Take one piece at a time, keeping the others covered, and flatten it slightly with your hand. Roll it out using a pasta machine or rolling pin until it''s thin to your liking (setting 7 or 8 on a standard pasta machine).\"}","{\"step\": 7, \"tools\": [\"Knife or pasta cutter\"], \"materials\": [\"Extra flour for dusting\"], \"description\": \"Cut the pasta into your desired shape (fettuccine, tagliatelle, etc.) using the pasta machine attachments or a sharp knife. Dust with flour to prevent sticking.\"}","{\"step\": 8, \"tools\": [\"Large pot\", \"Colander\"], \"materials\": [\"Salt (for pasta water)\", \"Water\"], \"description\": \"Cook fresh pasta in boiling salted water for 2-4 minutes until al dente. Drain and serve with your favorite sauce.\"}"}',
		'{"If you don''t have a pasta machine, a rolling pin works fine, just ensure the dough is evenly thin.","Resting the dough is crucial for good texture, so don''t skip this step.","Always start cooking pasta by boiling water with enough salt—it should taste like the sea.","Try experimenting with different pasta shapes to see which you prefer to make."}',
		'{"400g (3 1/3 cups) all-purpose flour","1/2 tsp salt","4 large eggs","Extra flour for dusting (as needed)","Plastic wrap","Salt (for pasta water)",Water}',
		'{"Clean, flat surface or large wooden board","Small bowl of extra flour for dusting",Fork,"Measuring cup",Hands,"Pasta machine or rolling pin","Knife or pasta cutter","Large pot",Colander}'
	),
	(
		'bad6312e-c5ad-4a50-992f-0ecec1659206',
		'How to Screw into Wood',
		'Screwing into wood is a fundamental skill for any DIY enthusiast or home repair hobbyist. Whether hanging a picture, fixing furniture, or assembling a project, learning how to effectively and securely drive screws into wood can make or break your task. This guide will provide you with step-by-step instructions, useful tips, and a comprehensive list of materials and tools to help you achieve the perfect installation every time.',
		'AI',
		'2024-11-28 13:46:19.444092',
		'{"{\"step\": 1, \"tools\": [\"Screwdriver or power drill\", \"Drill bit (slightly smaller than the screw''s diameter for pilot hole)\"], \"materials\": [\"Wood screws (1 - 2 inches in length, diameter varies by project)\", \"Wood pieces for practice or project\"], \"description\": \"Select the Right Screw and Drill Bit.\"}","{\"step\": 2, \"tools\": [\"Straight edge or ruler\"], \"materials\": [\"Pencil or marker\"], \"description\": \"Mark the Hole Location.\"}","{\"step\": 3, \"tools\": [\"Power drill\", \"Drill bit (appropriate size for pilot hole)\"], \"materials\": [], \"description\": \"Drill a Pilot Hole to Prevent Splitting.\"}","{\"step\": 4, \"tools\": [\"Screwdriver or power drill fitted with the correct bit\"], \"materials\": [], \"description\": \"Insert the Screw Using a Screwdriver or Drill.\"}","{\"step\": 5, \"tools\": [\"Screwdriver or power drill\", \"Countersink bit (optional)\"], \"materials\": [], \"description\": \"Ensure the Screw is Flush or Slightly Recessed.\"}"}',
		'{"Always choose a screw that is appropriate for the thickness of the wood. Too long, and it will break through the other side; too short, and it won''t hold properly.","Drilling a pilot hole not only makes it easier to drive the screw in but also prevents the wood from splitting.","Use a countersink bit if you want the screw head to be flush or below the wood surface, which is ideal for painting or finishing.","Work slowly with a power drill to avoid stripping the screw or damaging the wood.","For outdoor projects, consider using screws that are resistant to rust or corrosion."}',
		'{"Wood screws (1 - 2 inches)","Wood piece","Pencil or marker"}',
		'{"Screwdriver or power drill","Drill bit set","Straight edge",Ruler,"Countersink bit (optional)"}'
	),
	(
		'77b1c777-977e-48bf-8fe0-fcb443c75941',
		'Beginner''s Guide to Wood Carving a Simple Spoon',
		'Wood carving is both an art and a craft, bringing forth creations from a solid piece of wood with precision and patience. In this guide, you''ll learn the steps to carve a simple wooden spoon, perfect for beginners wanting to dive into the timeless tradition of wood carving.',
		'AI',
		'2024-11-28 14:04:54.355355',
		'{"{\"step\": 1, \"tools\": [], \"materials\": [\"Basswood block (approximately 10\\\" x 2\\\" x 2\\\")\"], \"description\": \"Select a suitable piece of wood. For beginners, basswood is recommended due to its softness and workability.\"}","{\"step\": 2, \"tools\": [\"Pencil\", \"Ruler\"], \"materials\": [], \"description\": \"Sketch the outline of the spoon on your wood block to guide the carving process.\"}","{\"step\": 3, \"tools\": [\"Carving knife\"], \"materials\": [], \"description\": \"Carve the rough shape of the spoon using a carving knife, focusing on the bowl and handle.\"}","{\"step\": 4, \"tools\": [\"Detail knife\"], \"materials\": [], \"description\": \"Refine the shape of the spoon, smoothing out edges and getting closer to the final shape.\"}","{\"step\": 5, \"tools\": [\"Gouge\"], \"materials\": [], \"description\": \"Hollow out the bowl of the spoon. Be careful not to make the bowl too thin.\"}","{\"step\": 6, \"tools\": [\"Medium grit sandpaper\", \"Fine grit sandpaper\"], \"materials\": [], \"description\": \"Sand the spoon to smooth any rough edges and achieve a nice finish.\"}","{\"step\": 7, \"tools\": [\"Cloth\"], \"materials\": [\"Food-safe wood oil or wax\"], \"description\": \"Apply a finish to the spoon for protection and to enhance its appearance.\"}"}',
		'{"Always carve away from yourself to prevent injury.","Work with the wood grain to make carving easier and prevent splitting.","Keep your tools sharp for cleaner cuts and easier carving.","Take breaks to prevent hand fatigue and maintain precision.","Start with softer woods, like basswood, as they are easier to carve for beginners."}',
		'{"Basswood block (approximately 10\" x 2\" x 2\")","Food-safe wood oil or wax"}',
		'{Pencil,Ruler,"Carving knife","Detail knife",Gouge,"Medium grit sandpaper","Fine grit sandpaper",Cloth}'
	);
--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tags" ("id", "created_at", "name")
VALUES (
		'aebec752-e2c0-4318-80fb-a15bfe56b414',
		'2024-11-27 22:59:08.235444+00',
		'homemade pasta'
	),
	(
		'f46ab301-396d-4141-a914-5bd994cf079e',
		'2024-11-27 22:59:08.235444+00',
		'italian cooking'
	),
	(
		'7a2428b0-6aa0-4c66-96e2-6bd4ecb764f4',
		'2024-11-27 22:59:08.235444+00',
		'fresh pasta'
	),
	(
		'bcc43462-081f-4346-9138-a16ddf007156',
		'2024-11-27 22:59:08.235444+00',
		'cooking from scratch'
	),
	(
		'f2e5e62d-e430-43a9-b69d-42e0be31921a',
		'2024-11-27 22:59:08.235444+00',
		'traditional recipes'
	),
	(
		'93755a1d-4f23-4097-8313-e45c93deb17d',
		'2024-11-28 13:46:19.437026+00',
		'woodworking'
	),
	(
		'78f4f303-e88c-4df8-87bb-71125af959dd',
		'2024-11-28 13:46:19.437026+00',
		'drilling into wood'
	),
	(
		'32d38134-128a-4c2a-b5c5-3e0250a0a3da',
		'2024-11-28 13:46:19.437026+00',
		'fastening techniques'
	),
	(
		'e388dfa7-d702-40fc-b3f9-26f33eb83524',
		'2024-11-28 13:46:19.437026+00',
		'basic carpentry'
	),
	(
		'0ed0c254-bd60-49f2-9b2d-42606ba7991c',
		'2024-11-28 13:46:19.437026+00',
		'construction skills'
	),
	(
		'f256e4df-a9d8-485b-96ec-eb5d71a350dc',
		'2024-11-28 14:04:54.340787+00',
		'wood carving'
	),
	(
		'696a0ec6-ee5e-4d80-8cb5-5e1bb5d5aeae',
		'2024-11-28 14:04:54.340787+00',
		'traditional techniques'
	);
--
-- Data for Name: guide_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."guide_tags" ("id", "created_at", "guide_id", "tag_id")
VALUES (
		'43fd3ea2-66ee-4dc6-80b7-6a68aea97261',
		'2024-11-27 22:59:08.266213+00',
		'd32435bf-d91c-45d6-ae25-b3f65a39a322',
		'aebec752-e2c0-4318-80fb-a15bfe56b414'
	),
	(
		'36ac0f08-d86b-490a-9eaf-c03aebc3542e',
		'2024-11-27 22:59:08.266213+00',
		'd32435bf-d91c-45d6-ae25-b3f65a39a322',
		'f46ab301-396d-4141-a914-5bd994cf079e'
	),
	(
		'4c2f178d-a4eb-453a-ade5-cb7b8a151565',
		'2024-11-27 22:59:08.266213+00',
		'd32435bf-d91c-45d6-ae25-b3f65a39a322',
		'7a2428b0-6aa0-4c66-96e2-6bd4ecb764f4'
	),
	(
		'4e2cf818-99a1-46e1-aa57-1d4f86160b32',
		'2024-11-27 22:59:08.266213+00',
		'd32435bf-d91c-45d6-ae25-b3f65a39a322',
		'bcc43462-081f-4346-9138-a16ddf007156'
	),
	(
		'c7241a45-7f1b-45be-9404-dbce9aa6f643',
		'2024-11-27 22:59:08.266213+00',
		'd32435bf-d91c-45d6-ae25-b3f65a39a322',
		'f2e5e62d-e430-43a9-b69d-42e0be31921a'
	),
	(
		'7fc88973-a20f-4c9d-ad68-48ac9e19d0eb',
		'2024-11-28 13:41:50.584053+00',
		'9af6b252-2c2c-40f0-99e9-ab6da367eb88',
		'aebec752-e2c0-4318-80fb-a15bfe56b414'
	),
	(
		'44b38dc6-16ad-4a3f-b4c9-b400a8b80f69',
		'2024-11-28 13:41:50.584053+00',
		'9af6b252-2c2c-40f0-99e9-ab6da367eb88',
		'f46ab301-396d-4141-a914-5bd994cf079e'
	),
	(
		'3dc8c02c-ccf4-4a1d-91c6-4846d3ba3055',
		'2024-11-28 13:41:50.584053+00',
		'9af6b252-2c2c-40f0-99e9-ab6da367eb88',
		'7a2428b0-6aa0-4c66-96e2-6bd4ecb764f4'
	),
	(
		'a436bcde-4ac6-438d-a6a4-2f4f07b7454f',
		'2024-11-28 13:41:50.584053+00',
		'9af6b252-2c2c-40f0-99e9-ab6da367eb88',
		'bcc43462-081f-4346-9138-a16ddf007156'
	),
	(
		'bd4e2fa3-a404-4bfe-bd3d-f82ecff2f296',
		'2024-11-28 13:41:50.584053+00',
		'9af6b252-2c2c-40f0-99e9-ab6da367eb88',
		'f2e5e62d-e430-43a9-b69d-42e0be31921a'
	),
	(
		'0a5a9070-e756-40d3-8259-d911f1e2478e',
		'2024-11-28 13:46:19.450177+00',
		'bad6312e-c5ad-4a50-992f-0ecec1659206',
		'93755a1d-4f23-4097-8313-e45c93deb17d'
	),
	(
		'b753dd21-d2fc-4026-9758-06974a58a4b8',
		'2024-11-28 13:46:19.450177+00',
		'bad6312e-c5ad-4a50-992f-0ecec1659206',
		'78f4f303-e88c-4df8-87bb-71125af959dd'
	),
	(
		'906fa755-47c3-4fb9-9355-40d7627e7362',
		'2024-11-28 13:46:19.450177+00',
		'bad6312e-c5ad-4a50-992f-0ecec1659206',
		'32d38134-128a-4c2a-b5c5-3e0250a0a3da'
	),
	(
		'625980e0-ca06-458c-bb05-bcda3253df97',
		'2024-11-28 13:46:19.450177+00',
		'bad6312e-c5ad-4a50-992f-0ecec1659206',
		'e388dfa7-d702-40fc-b3f9-26f33eb83524'
	),
	(
		'a313baa2-6d77-4bc5-a884-dfb19cf59044',
		'2024-11-28 13:46:19.450177+00',
		'bad6312e-c5ad-4a50-992f-0ecec1659206',
		'0ed0c254-bd60-49f2-9b2d-42606ba7991c'
	),
	(
		'27077a97-8b06-46c7-8905-fe1e9589e7b7',
		'2024-11-28 14:04:54.36521+00',
		'77b1c777-977e-48bf-8fe0-fcb443c75941',
		'f256e4df-a9d8-485b-96ec-eb5d71a350dc'
	),
	(
		'e5872d66-22c3-45b9-a08b-015398fb4b6e',
		'2024-11-28 14:04:54.36521+00',
		'77b1c777-977e-48bf-8fe0-fcb443c75941',
		'e388dfa7-d702-40fc-b3f9-26f33eb83524'
	),
	(
		'4597ad83-e300-45e3-a515-144ca1fd6f9a',
		'2024-11-28 14:04:54.36521+00',
		'77b1c777-977e-48bf-8fe0-fcb443c75941',
		'696a0ec6-ee5e-4d80-8cb5-5e1bb5d5aeae'
	);
--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user" (
		"id",
		"email",
		"full_name",
		"created_at",
		"updated_at",
		"tokens"
	)
VALUES (
		'e36896eb-7f8f-4298-b10b-cff565236eeb',
		'test@test.com',
		NULL,
		'2024-12-03 20:52:37.721339',
		'2024-12-03 20:52:37.721339',
		0
	),
	(
		'2b419da8-0f38-4013-8501-c2d7ee0ad18a',
		'test2@test.com',
		'Bora Alap',
		'2024-12-03 20:54:13.083109',
		'2024-12-03 20:54:13.083109',
		0
	);
--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 25, true);
--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);
--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);
--
-- PostgreSQL database dump complete
--

RESET ALL;