import httpInstance from "@/utils/http";

export const getModels = () => {
  return httpInstance({
    maxBodyLength: Infinity,
    url: "/api/sdapi/v1/sd-models"
  });
};

export const getSamplers = () => {
  return httpInstance({
    maxBodyLength: Infinity,
    url: "/api/sdapi/v1/samplers"
  });
};

export const getLoras = () => {
  return httpInstance({
    maxBodyLength: Infinity,
    url: "/api/sdapi/v1/loras"
  });
};

export const getVaes = () => {
  return httpInstance({
    maxBodyLength: Infinity,
    url: "/api/sdapi/v1/sd-vae"
  });
};

export const getScripts = () => {
  return httpInstance({
    maxBodyLength: Infinity,
    url: "/api/sdapi/v1/scripts"
  });
};

export const getfiles = (path) => {
  return httpInstance({
    maxBodyLength: Infinity,
    url: `/api//sd_extra_networks/thumb?filename=${path}`
  });
};

