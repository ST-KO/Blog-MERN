import React from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link } from 'react-router-dom';
import Thumbnail from '../images/blog22.jpg';

const PostDetail = () => {
  return (
    <section className='post-detail'>
      <div className="container post-detail__container">
        <div className="post-detail__header">
          <PostAuthor />
          <div className="post-detail__buttons">
            <Link to={`/posts/ads/edit`} className='btn sm primary'>Edit</Link>
            <Link to={`/posts/ads/delete`} className='btn sm danger'>Delete</Link>
          </div>
        </div>
        <h1>This is a post title</h1>
        <div className="post-detail__thumbnail">
          <img src={Thumbnail} alt="" />
        </div>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio magnam, maxime enim esse deserunt sit labore aspernatur repudiandae quae architecto quasi tenetur est, modi incidunt iure laborum quis sequi officia tempore nostrum repellendus obcaecati doloribus. Corporis, perferendis reiciendis. Aliquam, fugit.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat accusantium modi eligendi veritatis corrupti exercitationem blanditiis placeat tenetur saepe et nostrum vero, recusandae numquam. Enim excepturi ullam esse quibusdam officia!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat consequuntur nulla deserunt repellendus dolores ab, doloribus nostrum eaque suscipit consequatur est quas impedit neque beatae autem voluptates esse maiores repudiandae accusantium reiciendis facere perspiciatis! Tenetur quidem numquam nihil beatae repellendus velit facilis odio. Maiores modi omnis expedita autem excepturi provident voluptatibus odit quo maxime dicta beatae, facere dolor animi tempora esse dolores explicabo dolorem incidunt nostrum suscipit reprehenderit numquam doloribus est. Inventore deleniti unde repellendus iste incidunt earum quis aliquam commodi totam ratione itaque debitis blanditiis, dicta nulla. Sint voluptatum voluptates velit quaerat possimus totam, vel nulla? Porro voluptate consequuntur magnam corporis, delectus, maxime quas fugit in dolores, odio soluta distinctio.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam maiores esse libero temporibus vero accusamus, nemo optio laboriosam explicabo a!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus soluta delectus repudiandae cupiditate! Totam possimus cupiditate minus eligendi rem harum nemo fuga recusandae fugiat nesciunt culpa dignissimos reprehenderit nam consequuntur consectetur reiciendis iure, quaerat repellat exercitationem beatae optio molestiae accusamus, praesentium esse. Impedit, dignissimos. Recusandae explicabo et nam, doloremque ullam libero atque in delectus beatae, laborum perferendis eius dolorum quaerat quidem dolore earum mollitia dolores optio dignissimos quo soluta molestias nulla. Enim earum nemo pariatur error cum sequi. Aliquam aliquid a iste delectus autem. Debitis assumenda maiores doloribus totam quae, consequatur repellat eius illum eveniet facere iusto nulla iste. Laborum, amet eum maiores pariatur facilis assumenda tempore rem? Eveniet deserunt facere eos nam rem unde iste adipisci suscipit beatae cupiditate mollitia ex velit corporis culpa consectetur magni accusantium sunt inventore, autem blanditiis magnam nostrum explicabo quae. Illum distinctio error optio magni! Sed modi esse eligendi dicta odio nostrum voluptatibus dolore in non. Similique nulla ducimus atque omnis asperiores culpa ratione nihil iusto. Accusantium deleniti ex esse et! Alias illo eligendi, minus corrupti eaque doloribus! Est iusto, non beatae ipsam veniam voluptates voluptatum animi adipisci obcaecati pariatur repudiandae. Itaque non nostrum, cum dignissimos optio harum quidem? Illo delectus iure labore consequatur?
        </p>
      </div>
    </section>
  );
};

export default PostDetail;