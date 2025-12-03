"use client";

import React from "react";
import { useMDXComponent } from "next-contentlayer2/hooks";
import { MDXComponents } from "./MDXComponents";

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps): React.ReactElement {
  const Component = useMDXComponent(code);
  return React.createElement(Component, { components: MDXComponents });
}
