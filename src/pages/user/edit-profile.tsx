import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";

import Button from "../../components/button";
import useMe from "../../hooks/useMe";
import {
  editProfileMutation,
  editProfileMutationVariables,
} from "../../__generated__/editProfileMutation";
import PageTitle from "../../components/page-title";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfileMutation($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: editProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData?.me.email) {
      const {
        me: { email: previousEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (previousEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
      alert("Now your profile is successfully updated :-)");
      history.push("/");
    }
  };
  const [editProfile, { loading }] = useMutation<
    editProfileMutation,
    editProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted });
  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    defaultValues: {
      email: userData?.me.email,
    },
    mode: "onChange",
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          ...(email !== "" && email !== userData?.me.email && { email }),
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center ">
      <PageTitle title="Edit Profile" />
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 my-5 w-full "
      >
        <input
          ref={register({
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          className="input"
          name="email"
          type="email"
          placeholder="Email"
        />
        <input
          ref={register({ minLength: 8 })}
          className="input"
          name="password"
          type="password"
          placeholder="Password"
        />
        <Button
          actionText="Save Profile"
          loading={loading}
          canClick={formState.isValid}
        />
      </form>
    </div>
  );
};

export default EditProfile;
