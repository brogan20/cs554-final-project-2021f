import { gql } from '@apollo/client';

const GET_PORTFOLIO = gql`
    query {
        pokemon {
            _id
            name
            imageLink
            isHolo
        }
    }
`;

let queries = {
    GET_PORTFOLIO
}

export default queries;