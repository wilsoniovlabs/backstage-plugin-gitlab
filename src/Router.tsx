import { Entity } from '@backstage/catalog-model';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { Button } from '@material-ui/core';
import { GitlabCI } from './components/GitlabCI';
import { useEntity } from '@backstage/plugin-catalog-react';

const GITLAB_ANNOTATION_PROJECT_ID = 'gitlab.com/project-id';
export const GITLAB_ANNOTATION_PROJECT_SLUG = 'gitlab.com/project-slug';
export const GITLAB_ANNOTATION_SOURCE_LOCATION = 'backstage.io/source-location';

export const isGitlabAvailable = (entity: Entity) =>
isGitlabProjectIDAnnotationAvailable(entity) || isGitlabSlugAnnotationAvailable(entity)


export const isGitlabProjectIDAnnotationAvailable = (entity: Entity) =>
	Boolean(entity.metadata.annotations?.[GITLAB_ANNOTATION_PROJECT_ID]);

export const isGitlabSlugAnnotationAvailable = (entity: Entity) =>
	Boolean(entity.metadata.annotations?.[GITLAB_ANNOTATION_PROJECT_SLUG]);

type Props = {
	/** @deprecated The entity is now grabbed from context instead */
	entity?: Entity;
};

function tryToGetProjectSlug(entity: Entity){
	if (entity.metadata
		&& entity.metadata.annotations
		&& (!entity.metadata.annotations[GITLAB_ANNOTATION_PROJECT_SLUG]
			&& !entity.metadata.annotations[GITLAB_ANNOTATION_PROJECT_ID])) {
		const sourceLocation: string = entity.metadata.annotations[GITLAB_ANNOTATION_SOURCE_LOCATION];
		const projectName: string = sourceLocation.substring(0, sourceLocation.length - 1 )
			.replace('url:https://gitlab.com/', '');
		entity.metadata.annotations[GITLAB_ANNOTATION_PROJECT_SLUG] = projectName;
	}
}

export const Router = (_props: Props) => {
	const { entity } = useEntity();
	tryToGetProjectSlug(entity);
	if (
		isGitlabAvailable(entity)
	) {
		return (
			<Routes>
				<Route path="/" element={<GitlabCI />} />
			</Routes>
		);
	}

	return (
		<>
			<MissingAnnotationEmptyState annotation={GITLAB_ANNOTATION_PROJECT_ID} />
			<MissingAnnotationEmptyState
				annotation={GITLAB_ANNOTATION_PROJECT_SLUG}
			/>
			<Button
				variant='contained'
				color='primary'
				href='https://github.com/loblaw-sre/backstage-plugin-gitlab/blob/main/README.md'
			>
				Read Gitlab Plugin Docs
			</Button>
		</>
	);
};
