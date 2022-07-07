import { yupChipsValidation, postSchema } from '../../models/chips/postSchema';
import { dbSchema } from '../../models/chips/dbSchema';

export const newChipsValidation = async (
  chipsData: postSchema
): Promise<dbSchema> => {
  let inpData: dbSchema;
  await yupChipsValidation
    .validate(chipsData, { abortEarly: false })
    .then((value) => {
      inpData = {
        caption: value.caption,
        comments: {},
        likes: [],
        tags: value.tags.split(','),
        pictureUrl: [],
        circle: ['Public'],
      };
    });
  return inpData;
};
