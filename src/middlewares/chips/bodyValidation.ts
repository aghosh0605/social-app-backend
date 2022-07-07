import { yupChipsValidation, postSchema } from '../../models/chips/postSchema';
import { dbSchema } from '../../models/chips/dbSchema';

export const bodyValidator = async (
  chipsData: postSchema,
  picsUrls: Array<Object>
): Promise<dbSchema> => {
  let inpData: dbSchema;
  //console.log(chipsData);
  await yupChipsValidation
    .validate(chipsData, { abortEarly: false })
    .then((value) => {
      inpData = {
        caption: value.caption,
        comments: {},
        likes: [],
        tags: value.tags.split(','),
        pictureUrl: picsUrls,
        circle: value.circle.split(','),
      };
    });
  return inpData;
};
