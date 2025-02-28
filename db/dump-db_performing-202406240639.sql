PGDMP     #    '                |            db_performing %   14.12 (Ubuntu 14.12-0ubuntu0.22.04.1)    15.3 M    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    229456    db_performing    DATABASE     u   CREATE DATABASE db_performing WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';
    DROP DATABASE db_performing;
                postgres    false            �            1259    245849    npm_directorates    TABLE       CREATE TABLE public.npm_directorates (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    year_period_id uuid NOT NULL,
    directorate character varying(25) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 $   DROP TABLE public.npm_directorates;
       public         heap    postgres    false            �            1259    245865    npm_index_scores    TABLE     D  CREATE TABLE public.npm_index_scores (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    year_period_id uuid NOT NULL,
    index_value smallint NOT NULL,
    operator_1 character varying(2),
    value_1 numeric(5,1) DEFAULT 0,
    operator_2 character varying(2),
    value_2 numeric(5,1) DEFAULT 0,
    description text,
    color character varying(7),
    "order" smallint DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 $   DROP TABLE public.npm_index_scores;
       public         heap    postgres    false            �            1259    245906    npm_kpi_counters    TABLE     �  CREATE TABLE public.npm_kpi_counters (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    year_period_id uuid NOT NULL,
    counter character varying(255) NOT NULL,
    formula text,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 $   DROP TABLE public.npm_kpi_counters;
       public         heap    postgres    false            �            1259    245891    npm_kpi_polarizations    TABLE     �  CREATE TABLE public.npm_kpi_polarizations (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    year_period_id uuid NOT NULL,
    polarization character varying(255) NOT NULL,
    formula text,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 )   DROP TABLE public.npm_kpi_polarizations;
       public         heap    postgres    false            �            1259    254080    npm_kpi_unit_actual    TABLE     W  CREATE TABLE public.npm_kpi_unit_actual (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    kpi_unit_id uuid,
    actual text,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 '   DROP TABLE public.npm_kpi_unit_actual;
       public         heap    postgres    false            �            1259    254091    npm_kpi_unit_target    TABLE     W  CREATE TABLE public.npm_kpi_unit_target (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    kpi_unit_id uuid,
    target text,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 '   DROP TABLE public.npm_kpi_unit_target;
       public         heap    postgres    false            �            1259    270444    npm_kpi_unit_type_groups    TABLE     \  CREATE TABLE public.npm_kpi_unit_type_groups (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    group_type character varying(255),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 ,   DROP TABLE public.npm_kpi_unit_type_groups;
       public         heap    postgres    false            �            1259    270431    npm_kpi_unit_types    TABLE     w  CREATE TABLE public.npm_kpi_unit_types (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    unit_type character varying(50) NOT NULL,
    year_period_id uuid NOT NULL,
    perspective_id uuid,
    objective_id uuid,
    kpi_id uuid,
    measurement character varying(50),
    weight integer DEFAULT 0 NOT NULL,
    score numeric(10,2) DEFAULT 0 NOT NULL,
    description text,
    is_submit integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    group_id uuid
);
 &   DROP TABLE public.npm_kpi_unit_types;
       public         heap    postgres    false            �           0    0     COLUMN npm_kpi_unit_types.weight    COMMENT     D   COMMENT ON COLUMN public.npm_kpi_unit_types.weight IS 'persen (%)';
          public          postgres    false    234            �            1259    254066    npm_kpi_units    TABLE     �  CREATE TABLE public.npm_kpi_units (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    unit_id integer NOT NULL,
    year_period_id uuid NOT NULL,
    perspective_id uuid,
    objective_id uuid,
    kpi_id uuid,
    measurement character varying(50),
    weight integer DEFAULT 0 NOT NULL,
    score numeric(10,2) DEFAULT 0 NOT NULL,
    description text,
    is_submit_target integer DEFAULT 0 NOT NULL,
    is_submit_actual integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 !   DROP TABLE public.npm_kpi_units;
       public         heap    postgres    false            �           0    0    COLUMN npm_kpi_units.weight    COMMENT     ?   COMMENT ON COLUMN public.npm_kpi_units.weight IS 'persen (%)';
          public          postgres    false    225            �            1259    245923    npm_kpis    TABLE     �  CREATE TABLE public.npm_kpis (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    kpi character varying(255) NOT NULL,
    year_period_id uuid NOT NULL,
    kpi_counter_id uuid NOT NULL,
    kpi_polarization_id uuid NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
    DROP TABLE public.npm_kpis;
       public         heap    postgres    false            �            1259    237682    npm_last_login    TABLE     �  CREATE TABLE public.npm_last_login (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    user_id character varying(255) NOT NULL,
    session_data character varying(255) NOT NULL,
    machine_ip character varying(255) NOT NULL,
    user_agent character varying(255) NOT NULL,
    agent_string character varying(255) NOT NULL,
    platform character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 "   DROP TABLE public.npm_last_login;
       public         heap    postgres    false            �            1259    237671    npm_objectives    TABLE     {  CREATE TABLE public.npm_objectives (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    year_period_id uuid NOT NULL,
    objective character varying(75) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 "   DROP TABLE public.npm_objectives;
       public         heap    postgres    false            �            1259    237647    npm_perspectives    TABLE       CREATE TABLE public.npm_perspectives (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    year_period_id uuid NOT NULL,
    perspective character varying(25) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 $   DROP TABLE public.npm_perspectives;
       public         heap    postgres    false            �            1259    278607    npm_unit_kpi_unit_type_group    TABLE     o   CREATE TABLE public.npm_unit_kpi_unit_type_group (
    group_id uuid NOT NULL,
    unit_id integer NOT NULL
);
 0   DROP TABLE public.npm_unit_kpi_unit_type_group;
       public         heap    postgres    false            �            1259    237657 	   npm_users    TABLE     �  CREATE TABLE public.npm_users (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(128) NOT NULL,
    password character varying(255) NOT NULL,
    profile_picture character varying(255),
    is_active integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.npm_users;
       public         heap    postgres    false            �            1259    237688    npm_year_periods    TABLE     x  CREATE TABLE public.npm_year_periods (
    id uuid DEFAULT public.generate_uuid_v7() NOT NULL,
    year_period character varying(4) NOT NULL,
    status_appraisal smallint DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid
);
 $   DROP TABLE public.npm_year_periods;
       public         heap    postgres    false            �           0    0 (   COLUMN npm_year_periods.status_appraisal    COMMENT     \   COMMENT ON COLUMN public.npm_year_periods.status_appraisal IS '0 - Not Active, 1 - Active';
          public          postgres    false    214            �          0    245849    npm_directorates 
   TABLE DATA           �   COPY public.npm_directorates (id, year_period_id, directorate, description, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    218   �y       �          0    245865    npm_index_scores 
   TABLE DATA           �   COPY public.npm_index_scores (id, year_period_id, index_value, operator_1, value_1, operator_2, value_2, description, color, "order", created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    219   �y       �          0    245906    npm_kpi_counters 
   TABLE DATA           �   COPY public.npm_kpi_counters (id, year_period_id, counter, formula, description, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    221   {       �          0    245891    npm_kpi_polarizations 
   TABLE DATA           �   COPY public.npm_kpi_polarizations (id, year_period_id, polarization, formula, description, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    220   �{       �          0    254080    npm_kpi_unit_actual 
   TABLE DATA           �   COPY public.npm_kpi_unit_actual (id, kpi_unit_id, actual, description, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    226   �}       �          0    254091    npm_kpi_unit_target 
   TABLE DATA           �   COPY public.npm_kpi_unit_target (id, kpi_unit_id, target, description, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    227   �~       �          0    270444    npm_kpi_unit_type_groups 
   TABLE DATA              COPY public.npm_kpi_unit_type_groups (id, group_type, description, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    235   �       �          0    270431    npm_kpi_unit_types 
   TABLE DATA           �   COPY public.npm_kpi_unit_types (id, unit_type, year_period_id, perspective_id, objective_id, kpi_id, measurement, weight, score, description, is_submit, created_at, updated_at, created_by, updated_by, group_id) FROM stdin;
    public          postgres    false    234   {�       �          0    254066    npm_kpi_units 
   TABLE DATA           �   COPY public.npm_kpi_units (id, unit_id, year_period_id, perspective_id, objective_id, kpi_id, measurement, weight, score, description, is_submit_target, is_submit_actual, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    225   ��       �          0    245923    npm_kpis 
   TABLE DATA           �   COPY public.npm_kpis (id, kpi, year_period_id, kpi_counter_id, kpi_polarization_id, description, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    222   ��       �          0    237682    npm_last_login 
   TABLE DATA              COPY public.npm_last_login (id, user_id, session_data, machine_ip, user_agent, agent_string, platform, created_at) FROM stdin;
    public          postgres    false    213   Î       �          0    237671    npm_objectives 
   TABLE DATA           �   COPY public.npm_objectives (id, year_period_id, objective, description, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    212   d�       �          0    237647    npm_perspectives 
   TABLE DATA           �   COPY public.npm_perspectives (id, year_period_id, perspective, description, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    210   ��       �          0    278607    npm_unit_kpi_unit_type_group 
   TABLE DATA           I   COPY public.npm_unit_kpi_unit_type_group (group_id, unit_id) FROM stdin;
    public          postgres    false    236   �       �          0    237657 	   npm_users 
   TABLE DATA           r   COPY public.npm_users (id, name, email, password, profile_picture, is_active, created_at, updated_at) FROM stdin;
    public          postgres    false    211   ��       �          0    237688    npm_year_periods 
   TABLE DATA           }   COPY public.npm_year_periods (id, year_period, status_appraisal, created_at, updated_at, created_by, updated_by) FROM stdin;
    public          postgres    false    214   ��                  2606    245858 $   npm_directorates npm_directorates_pk 
   CONSTRAINT     b   ALTER TABLE ONLY public.npm_directorates
    ADD CONSTRAINT npm_directorates_pk PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.npm_directorates DROP CONSTRAINT npm_directorates_pk;
       public            postgres    false    218                       2606    245877 $   npm_index_scores npm_index_scores_pk 
   CONSTRAINT     b   ALTER TABLE ONLY public.npm_index_scores
    ADD CONSTRAINT npm_index_scores_pk PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.npm_index_scores DROP CONSTRAINT npm_index_scores_pk;
       public            postgres    false    219                       2606    245915 $   npm_kpi_counters npm_kpi_counters_pk 
   CONSTRAINT     b   ALTER TABLE ONLY public.npm_kpi_counters
    ADD CONSTRAINT npm_kpi_counters_pk PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.npm_kpi_counters DROP CONSTRAINT npm_kpi_counters_pk;
       public            postgres    false    221                       2606    245900 .   npm_kpi_polarizations npm_kpi_polarizations_pk 
   CONSTRAINT     l   ALTER TABLE ONLY public.npm_kpi_polarizations
    ADD CONSTRAINT npm_kpi_polarizations_pk PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.npm_kpi_polarizations DROP CONSTRAINT npm_kpi_polarizations_pk;
       public            postgres    false    220            #           2606    254100 *   npm_kpi_unit_target npm_kpi_unit_target_pk 
   CONSTRAINT     h   ALTER TABLE ONLY public.npm_kpi_unit_target
    ADD CONSTRAINT npm_kpi_unit_target_pk PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.npm_kpi_unit_target DROP CONSTRAINT npm_kpi_unit_target_pk;
       public            postgres    false    227            '           2606    270450 4   npm_kpi_unit_type_groups npm_kpi_unit_type_groups_pk 
   CONSTRAINT     r   ALTER TABLE ONLY public.npm_kpi_unit_type_groups
    ADD CONSTRAINT npm_kpi_unit_type_groups_pk PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.npm_kpi_unit_type_groups DROP CONSTRAINT npm_kpi_unit_type_groups_pk;
       public            postgres    false    235            %           2606    270443 (   npm_kpi_unit_types npm_kpi_unit_types_pk 
   CONSTRAINT     f   ALTER TABLE ONLY public.npm_kpi_unit_types
    ADD CONSTRAINT npm_kpi_unit_types_pk PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.npm_kpi_unit_types DROP CONSTRAINT npm_kpi_unit_types_pk;
       public            postgres    false    234                       2606    254079     npm_kpi_units npm_kpi_units_pk_1 
   CONSTRAINT     ^   ALTER TABLE ONLY public.npm_kpi_units
    ADD CONSTRAINT npm_kpi_units_pk_1 PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.npm_kpi_units DROP CONSTRAINT npm_kpi_units_pk_1;
       public            postgres    false    225                       2606    245932    npm_kpis npm_kpis_pk 
   CONSTRAINT     R   ALTER TABLE ONLY public.npm_kpis
    ADD CONSTRAINT npm_kpis_pk PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.npm_kpis DROP CONSTRAINT npm_kpis_pk;
       public            postgres    false    222                       2606    237680     npm_objectives npm_objectives_pk 
   CONSTRAINT     ^   ALTER TABLE ONLY public.npm_objectives
    ADD CONSTRAINT npm_objectives_pk PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.npm_objectives DROP CONSTRAINT npm_objectives_pk;
       public            postgres    false    212                       2606    237656 $   npm_perspectives npm_perspectives_pk 
   CONSTRAINT     b   ALTER TABLE ONLY public.npm_perspectives
    ADD CONSTRAINT npm_perspectives_pk PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.npm_perspectives DROP CONSTRAINT npm_perspectives_pk;
       public            postgres    false    210            !           2606    254089 &   npm_kpi_unit_actual npm_unit_actual_pk 
   CONSTRAINT     d   ALTER TABLE ONLY public.npm_kpi_unit_actual
    ADD CONSTRAINT npm_unit_actual_pk PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.npm_kpi_unit_actual DROP CONSTRAINT npm_unit_actual_pk;
       public            postgres    false    226            )           2606    278626 <   npm_unit_kpi_unit_type_group npm_unit_kpi_unit_type_group_pk 
   CONSTRAINT     �   ALTER TABLE ONLY public.npm_unit_kpi_unit_type_group
    ADD CONSTRAINT npm_unit_kpi_unit_type_group_pk PRIMARY KEY (group_id, unit_id);
 f   ALTER TABLE ONLY public.npm_unit_kpi_unit_type_group DROP CONSTRAINT npm_unit_kpi_unit_type_group_pk;
       public            postgres    false    236    236                       2606    237667    npm_users npm_users_pk 
   CONSTRAINT     T   ALTER TABLE ONLY public.npm_users
    ADD CONSTRAINT npm_users_pk PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.npm_users DROP CONSTRAINT npm_users_pk;
       public            postgres    false    211                       2606    237696 $   npm_year_periods npm_year_periods_pk 
   CONSTRAINT     b   ALTER TABLE ONLY public.npm_year_periods
    ADD CONSTRAINT npm_year_periods_pk PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.npm_year_periods DROP CONSTRAINT npm_year_periods_pk;
       public            postgres    false    214                       2606    237756 (   npm_year_periods npm_year_periods_unique 
   CONSTRAINT     j   ALTER TABLE ONLY public.npm_year_periods
    ADD CONSTRAINT npm_year_periods_unique UNIQUE (year_period);
 R   ALTER TABLE ONLY public.npm_year_periods DROP CONSTRAINT npm_year_periods_unique;
       public            postgres    false    214            7           2620    245864 )   npm_directorates update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_directorates FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 B   DROP TRIGGER update_timestamp_trigger ON public.npm_directorates;
       public          postgres    false    218            8           2620    245889 )   npm_index_scores update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_index_scores FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 B   DROP TRIGGER update_timestamp_trigger ON public.npm_index_scores;
       public          postgres    false    219            :           2620    245921 )   npm_kpi_counters update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_kpi_counters FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 B   DROP TRIGGER update_timestamp_trigger ON public.npm_kpi_counters;
       public          postgres    false    221            9           2620    245922 .   npm_kpi_polarizations update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_kpi_polarizations FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 G   DROP TRIGGER update_timestamp_trigger ON public.npm_kpi_polarizations;
       public          postgres    false    220            <           2620    254090 ,   npm_kpi_unit_actual update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_kpi_unit_actual FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 E   DROP TRIGGER update_timestamp_trigger ON public.npm_kpi_unit_actual;
       public          postgres    false    226            =           2620    254101 ,   npm_kpi_unit_target update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_kpi_unit_target FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 E   DROP TRIGGER update_timestamp_trigger ON public.npm_kpi_unit_target;
       public          postgres    false    227            ?           2620    270452 1   npm_kpi_unit_type_groups update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_kpi_unit_type_groups FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 J   DROP TRIGGER update_timestamp_trigger ON public.npm_kpi_unit_type_groups;
       public          postgres    false    235            >           2620    270451 +   npm_kpi_unit_types update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_kpi_unit_types FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 D   DROP TRIGGER update_timestamp_trigger ON public.npm_kpi_unit_types;
       public          postgres    false    234            ;           2620    245938 !   npm_kpis update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_kpis FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 :   DROP TRIGGER update_timestamp_trigger ON public.npm_kpis;
       public          postgres    false    222            5           2620    237681 '   npm_objectives update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_objectives FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 @   DROP TRIGGER update_timestamp_trigger ON public.npm_objectives;
       public          postgres    false    212            3           2620    237670 )   npm_perspectives update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_perspectives FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 B   DROP TRIGGER update_timestamp_trigger ON public.npm_perspectives;
       public          postgres    false    210            4           2620    237669 "   npm_users update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 ;   DROP TRIGGER update_timestamp_trigger ON public.npm_users;
       public          postgres    false    211            6           2620    237697 )   npm_year_periods update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.npm_year_periods FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 B   DROP TRIGGER update_timestamp_trigger ON public.npm_year_periods;
       public          postgres    false    214            ,           2606    245859 5   npm_directorates npm_directorates_npm_year_periods_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.npm_directorates
    ADD CONSTRAINT npm_directorates_npm_year_periods_fk FOREIGN KEY (year_period_id) REFERENCES public.npm_year_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 _   ALTER TABLE ONLY public.npm_directorates DROP CONSTRAINT npm_directorates_npm_year_periods_fk;
       public          postgres    false    3345    218    214            -           2606    245878 5   npm_index_scores npm_index_scores_npm_year_periods_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.npm_index_scores
    ADD CONSTRAINT npm_index_scores_npm_year_periods_fk FOREIGN KEY (year_period_id) REFERENCES public.npm_year_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 _   ALTER TABLE ONLY public.npm_index_scores DROP CONSTRAINT npm_index_scores_npm_year_periods_fk;
       public          postgres    false    3345    214    219            /           2606    245916 5   npm_kpi_counters npm_kpi_counters_npm_year_periods_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.npm_kpi_counters
    ADD CONSTRAINT npm_kpi_counters_npm_year_periods_fk FOREIGN KEY (year_period_id) REFERENCES public.npm_year_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 _   ALTER TABLE ONLY public.npm_kpi_counters DROP CONSTRAINT npm_kpi_counters_npm_year_periods_fk;
       public          postgres    false    214    221    3345            .           2606    245901 ?   npm_kpi_polarizations npm_kpi_polarizations_npm_year_periods_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.npm_kpi_polarizations
    ADD CONSTRAINT npm_kpi_polarizations_npm_year_periods_fk FOREIGN KEY (year_period_id) REFERENCES public.npm_year_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 i   ALTER TABLE ONLY public.npm_kpi_polarizations DROP CONSTRAINT npm_kpi_polarizations_npm_year_periods_fk;
       public          postgres    false    214    3345    220            1           2606    278620 A   npm_kpi_unit_types npm_kpi_unit_types_npm_kpi_unit_type_groups_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.npm_kpi_unit_types
    ADD CONSTRAINT npm_kpi_unit_types_npm_kpi_unit_type_groups_fk FOREIGN KEY (group_id) REFERENCES public.npm_kpi_unit_type_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;
 k   ALTER TABLE ONLY public.npm_kpi_unit_types DROP CONSTRAINT npm_kpi_unit_types_npm_kpi_unit_type_groups_fk;
       public          postgres    false    3367    235    234            0           2606    245933 %   npm_kpis npm_kpis_npm_year_periods_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.npm_kpis
    ADD CONSTRAINT npm_kpis_npm_year_periods_fk FOREIGN KEY (year_period_id) REFERENCES public.npm_year_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 O   ALTER TABLE ONLY public.npm_kpis DROP CONSTRAINT npm_kpis_npm_year_periods_fk;
       public          postgres    false    222    3345    214            +           2606    245839 1   npm_objectives npm_objectives_npm_year_periods_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.npm_objectives
    ADD CONSTRAINT npm_objectives_npm_year_periods_fk FOREIGN KEY (year_period_id) REFERENCES public.npm_year_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 [   ALTER TABLE ONLY public.npm_objectives DROP CONSTRAINT npm_objectives_npm_year_periods_fk;
       public          postgres    false    212    3345    214            *           2606    245844 5   npm_perspectives npm_perspectives_npm_year_periods_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.npm_perspectives
    ADD CONSTRAINT npm_perspectives_npm_year_periods_fk FOREIGN KEY (year_period_id) REFERENCES public.npm_year_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 _   ALTER TABLE ONLY public.npm_perspectives DROP CONSTRAINT npm_perspectives_npm_year_periods_fk;
       public          postgres    false    210    3345    214            2           2606    278610 U   npm_unit_kpi_unit_type_group npm_unit_kpi_unit_type_group_npm_kpi_unit_type_groups_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.npm_unit_kpi_unit_type_group
    ADD CONSTRAINT npm_unit_kpi_unit_type_group_npm_kpi_unit_type_groups_fk FOREIGN KEY (group_id) REFERENCES public.npm_kpi_unit_type_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;
    ALTER TABLE ONLY public.npm_unit_kpi_unit_type_group DROP CONSTRAINT npm_unit_kpi_unit_type_group_npm_kpi_unit_type_groups_fk;
       public          postgres    false    236    235    3367            �      x������ � �      �   ^  x���?k1�kݧ0\=b�H���I��7i�ho�������n���"��x�߼""9
������6�\�Ll'�a"c�R��� ��^�!�����`1�µ�:���?a�S�a���x�21MY#�j�פ���,ŹB�\ �Zsk��&�/a;�.
��:{�e�m��)-������2`{���pA�[4'�&��(X��S)L拔m��Kﰼ���S�k��V�H&Lѝ(�5�v�����6�niicmc�������(�\��>&�pX/	��p"��I���&�h8:η���e�۩΄yI�1�|
��<��M���Sʔ8RR�/(���А��c��v� �r/      �   �   x���=N1�:s
.����鶢����g���L��X@S@g�=���Q��N���Ӭ���;Y�[����Z@���fC������./	ҾT�
��+���Ѽ��G"��1��Ð�`���@G�^c�8TZ��T�w�b`�l¾�\��c����O&�\Lk��H5i�?��`G�M�I��|��t:�~�"\�fm�n�E���eY>{Ȏ�      �   �  x���͎�0���S������o� � �X�쉃"u�Ѵ�F �;�U����]���\��#"�G֦k���!h�ƱS���c9�6?��hado{��W����0�Jm��~����z]��ߟ ��?��9����3T��IFr�TF��tA����m�^�f�K�ĥ�[���/�����
�l�4��՚hM�Qh�5i2�!I�`=^[P)˜R�馢�Y��}����A�ަ�7�e�)�w��Øe��S�w%�#8fY)l6�p��L/�$�Q���`�,��M1;�{���9�x�B�o���!�a3��>/���ӏt�'��}8q���O�Fq6�4�����K.��-�2�D�gU.��k��g�H_��&�|�p��j^Gmto�D���	/ӽ��{��<KS�a���z��֬V���ga�      �     x���Kn� @��)���� ��	f.Q���L�FUU��y[��0""%�h�
�7�D�j�s�}³H��w(�k����B����в-��.|��d<��`��i��Ζķ�c��M����/��&������304�B�9Y m9��:�_�xW�A�Bvb��E}w-��T�BP=:Qm@����Q�e�4�ᓜQ��Wl�RJ������'g�p2����-��N�3�v�ݑ�5b�s�d(#�:�2�+eJ��h�7��P��]�y�?]C      �   %  x���In�0E��)
�K���=A6�L_��ݫ��;E�6��$~��P@vO�x30a��)9Uٲ��Gɥ�h�`=K0[�Wʱ�M�D,��č�XJCmH�z4B�n߰Qj�-sO�Ix�_�e8=����� K��(��0�?bp��q�b!�z)��}g�Ui<ܨ
A*��i>�l�Xs�2|(q���^Bu(�܊���@��D��㋦�%Ğ�&�	��|�B:��x'q�H�R������j�~SUZ��^w�5vq�i���c��n�l�8�q��w��q|	m�'      �   d   x�����0ki�,@����г�! f�l�}�;����O�N	�-��o액є��!X���:�jk��Bx���M�`J��4*�ɪ/�/������&S      �      x������ � �      �   P  x�ݝK�ݶ��ʯȤC���/;kA�q&|���(�?�[>''	B�� E�a����+�E�ER4 @4ȁ� :4T4R{OC0jI�$�����b
"��u���L�8������Pr�)USn;��C��h�P�`"#�B���y�c(R��0��EJ/c��ߗ/��ÿ�-�������6�_^���/!D��C�h��I��_����A	G�jǞ��W3� YG��k��!$R��l�n���7��?�(���~%����۠=)T�7&�E�l��P�\���K5�Y���Zxn����o�w[�5��eԏ�>&��`��NZ��Oq0�\Ea�~5��$�B�+R���6��D~���;i	�J��"�Vr�(R6�t�""�%}'��T��y[L��W9��x���eyIK �������5aoCd�˹{ɀ�@��HOA��0k�5��5-W9��d������H�^0�{;��g�m���-D23�w�V�^�>SI�Vt��@Ni!^b&~'��L
:�^�	}�i����۷ \�2Oi	���[�Zk�L���j ��34�蘆}�ʨH�'W���>Ǿ���#�"	4)�����J�z?^Ձ����mz���&�n	�t �/���F}�g������>2�����&���w���U�4F�6�L�4�����K)j:wi��l17ӜEҫ���xsD�w�:��v�|���'��'�o>�x�c�~蝴R��*{/�s�J3_����ƕ[}I뀷7����`E@6�?@�e M�5���1�HS���TC��9�W%� i���X4�L�[
ifxz�T�9�7{o|�����̿�����}��9��,�:�=�u�I^�j�Gr5��ҡ����b٩��5�	�E(0��Ȣ��/rN�5]O=�u���$�(S��3Mŉl�w�5SW3�����4kH�V�>�q��>��13���K:0�%�l�WW��^��2￻�������P��s�9tf�A|5��3>��IZ�HnAp_�,ȥ�Z��+��>/��]���`F�!0��X��1��� e�j&��]fMy�!�;�x-4`���z�Fp��w�pei�^�H�P9R�1*���x5�S��+��%林�w�yg�0j����Q�� �� ����) �p�}�s�[�Y�r�WŘ~1g�ki	�����)Fsij}l��?#���ۺ�<�5j��쁚պ��lx5�SZq\��<�u�#�ҁ�	���Y��M����4FXΪ��5/��[V�D�x���@Ni!-���CYǻﺆ<�ܳz�ѻχx�C��r!/i$����{3nu���j ���,�W]�KZ��,A���n@�j)s�A>ü������ -��-�c���	���@NȻ^18�vi��0go�c�T1�I�c#���|c��H�����e��R��@N�1�Tpc��ڵGw�*[e��"U��v����M�� �=�5䠝d�gmFhI�j �]��K���֫TнG����Q8꾎y���v��)���*�+kJ���H�j �]���]�SZ�:������V���te�{���$�n!Oi�9�uԉu@����t���xJ��]�%�N+1��\w��C��R�GA�!��H	��cNd�#���@�	��`*�)$�����������ql���n!�<7�ȏ�y2���2���r5�s�.{+?X�~H�\玬v���x�bs��9m�N�t�N:`����`gH>�䫙��r��Dއ����4�5����z�������fD����t �ݙ��mUfM�@���?#�`b�g�)�' ܦ���sE�i�wZ�p�q�?�H	V�KZ�W��oU�γ�.W9%�J����Oi=�'����D�mf��qc��W��%��r�í{�O�#&l�VD��8Nq���l���:��;2%��{�6b�����Լ�ퟄ5B�}����fW�8g&��c^�:�+��<��Leب:Ё���\8Z�}Jk ^z�1݋H��3�\�<�����_m�%3B��Y�5�46����x��o<~#����� ����]��ū��3���u�����֖C�gɘhH�_���2�����w��}���ɈJ�������3b٣�;����PF��'�Vkul�����Ow���@���S(�z�Y�[��9�T�&�%�M��#D<��Q{Q�y���}�컃@���SZ��o=����T5��9)�`_Xz#��;{i�=�T�Z����ܾ��� �7˞��H(�U�u�\�8��)-$��h}��SZ[�ւ椡$�QJi��?鲬'�~T�8�߇!b��4��j����8'�h��9���ƽ�w���&��X��F���B�"ǃ%̇�R����!�[��s�=��@�9||�Xw�Oimܥ��^Ll����Ʒ�[�"$\�����@4���ތF����@NI21��P���m��B���/O/M�(�݃�7gaZo�{Jk c��I�2�f�}:5�Z ��VRXE�����̡�\BR����� dt`B���xȍ��TZ�ltO�9'�H���SZ�v-��� ���lX�}H�{qk� �Ik �Ak��U�"M��t5�sr��N���6���D���%α{�����lN}(8$�:6�DH��j�)uߪ�FZ������3p��B�wpq���T��������~5�{�8��]���Q�}Jk�n�K�}�)�{&����l���^�w�H�P��L��΍Lݖ]�C1��KC/i}:�~� ���닢ޡ�`EFr��F�����s ��~&�?0�j �$�ry��KZweet�ɀr��h��g]�_����KZ1��h��:�w7���@�93���-~3ԝiVڠ2����w�I ^zJk ����Щ'(���j �����ç��e�U"�s�HI�{���⻷A����t ���t���`5�^��@�I2�kt �!���*Z�\cQӺ�4tw���<�څ�� �9��m�(u�O��@�I2V� �<��q�,���U�������ݹY<X�xH@��d���/E�� i3^�$���=��� ���/���N���      �   �  x�͕�jA����Ть�oɡJZ��؋fGSel���JSj,=�$��O|3�I�"�+聸 $"��)�(I��p�4�1���O���!%�*-2xOH%����-"��$A%�P={q>�QtY��9�k
���9K���G[緞���&=��o���NT�zT���T���f��KVȡU�))1g�*�|>>�Q·�e�������t%\��r��+G����_�
[�)�O�k�up�T9vh5r���i���ٿ4.O�Cp~M��_״�J��.1:���}����Qβ��T�[9� ��T)�5�*���\�YA1�ֳ���;>���;t'�|{uP��4QB�+u)]����knX(��܇���W�m��q)+�u���"V��^6t����a��rX���b�{:���	8b�iM���L���'�x׃      �   �  x��[o[�ǟ�OA�)�ǳ3����OnQ4@b��䥀�ט�,
��N�|���r��REӄ�"�H�7��� �F@�]K&@�&�&�g��)
���U4!b2)�`�GR@l�c;���$�n�y�}����z�I'翥W��֧g۾9n/O7���L�9�<>��h��џ_�m_��g�m���c?��7'�o����Գ���x�'������ʯ�t�9��������߮�����[�as��S��W����O�~�nu������ʯ�oWo��E}��o�l���Y�H=�m���_�/ח�{�#t�ظ�n�&��?���{"�����C��r=��f'�����Kv͙�"�Ⱦ��
�Z|v�6����T_oNֳ�'�3�I�ܼ	X����t
��r�^�ϛ�������O+��>��������A{��>�Fa�a
 n�M;�	ޣI���zN�[�t�v�ͅփ��-j�ku`�K�Ep�r�no����$A|\r���V���3ۮ��B퇆w{��aF7y����n#��&��'<�����go'�,Af��W%J]k�7�N�� � �N�	,������ۦ�H�pt�3P{�I���,�)��v��c�ʨՄ����)�FM�	�(3���(��`B��R6B[��Gw��o��vnrLKn%�&t���T�����P>p�܂b��3�g�Zf'|�Ǖ>Ȩ�v�D��a��?"�~~y�*���j�b{�~K�=�NQML6�R�T�-]5�Yo26���_)'�Qi6 \�a2@���#�L\M���ʱ���6�2#�:CI.@:� �UGn��Su�b3�kL8��8�(L�_r�ɒfPP�`�G6UJ�E�X�p�q5�����:�%7VqK)*���X�н�J�>�k���8��r�X�k%m� ���T�6���ݓt��ϓ F����e�����B��Ұʾ��
�5�j�)��]b��Қ��TF\Sϙ�k��d�ɩI�	| ��)�rƦQ6NF[O�v��;����/^x����V�q���ݖ��T�����]�&��� �����y�v�X]3�kG�%�
���/���A��o`)�Na�d�
{K����}���ٓ�y����VU5�bMJ2V]�kM6���J�i�IY�M,͚ 5��[�L7�B�D�u�;n4�S�&��>�^�	9���:W��.v��ɪHp.�,Ze��PDk��MB�����iٓtR��qZe)�\%Ю^���i�z���н��v�S��M�	��x;��8�"�֔�{V���U��=]c�[�#U.�'�ՋMޞm?�^�ok�������^<x~�..��	�|�t{���l��*�趧^�r��<���mg���a��4/�U���l��:�B��13����ڛy�ѹ%~f�~UyT��hn�&�N�;v\7csk\>�?��n�"2jb�V�[XFD�T����.A��rU/w(���/�N�e�E��QEW�=�=yW$f{����zL��fy�C���P ���@��\R�wu|x��ds���,�/2.vlJT<�x�(�9!�D�t�FJs�wu#.1���:.��B��+�O�"�,�>�22Q燩5�45����o��@�%r{rb~ΎOh���������0xS%K��\}}�
���ڛ
�ﶟ�H��'��9�lȡ�D]�����TО��ƫ8�7�4�S*����5�Y<���7���/qX*��ل�Ǒm�d�s���%n���kx%����)z�2��X{�W�%I�V[ڃ{�=%W�pr��ő��hZ�L��_Цq��#¾��.�&�`����&gK1� �Ln��c&���s��9��S��4>�7� (�C�8C%[��+�Tl�,��T.���%t	;;�8w��z��و�cI�n�;�^����K�u�cz��� x�1       �   !  x����J1��w��/0��?�+��x��$��5�n���Z�,R��΁��CD�\,�`�9֑�MFv�5�R�s-�l(%QW<���r��D����k�-�qw�酨vе�� q�r�~�rP>��K��}	��$�@3����H�Ө�&a�HlT�o�MJ�x�����9�����A)+P,U�!5�bsZ4�`s��(�p�'������t�myG��Vis�ƣ�5���O��I���B����Jt<�Rm�aGu�i?�G��y�m�F�T������;����      �   <  x����J�0���S�L��d2M�
� ��eڤ��v�]���(�(�����|�$ADt\"�%A��g�c���T����j���	)�آ���d�p�cUY��w�::�6,!����c2'�%�EQ��L�r)oj�'A�g��i�(j#o��~]Χ�<���H"e�5t��~^U?���{�o����y�츻z]S^���|����uH��e,М�Y6��ɢ	m���6O��iw;���������@~]��C[bۈ�Iy��#E��}��l��j��+y�JymȫS]Ce����7u]���      �      x������ � �      �   �   x�}ɻ�0 й|k��R�e�#5�8���$*�z�O �Ѐ���P#q�Aȥ!
��Ѱ��ƞU����H'v��~D1=ި�����NZ��f���R���eg�ރ���f�%j����|I���}�V4�[&J.�:��|TR�)�p-�� +87�      �   �   x���A�0��+�������>������O �Bp��+�J3 ��,Z��l$��Er&�vT�F��>�`�,Z�R�A��W��LL�^�a�� ��os6i����fd�{��d�7d#�2��[��냓~qE��W�1�Tg4ι�)�x��DO     