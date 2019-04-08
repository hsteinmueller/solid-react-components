import React from "react";
import { render, cleanup, fireEvent } from 'react-testing-library';
import auth from "solid-auth-client";
import ShexForm from "./shex-form.component";
import 'jest-dom/extend-expect';


afterAll(cleanup);


describe("Shex Form Component", () => {
    const { container, getByTestId } = render(<ShexForm />);

    it("shoud renders without crashing", () => {
        expect(container).toBeTruthy();
    });

});
