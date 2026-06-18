import { Group } from "../../models/Group/group.model.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/User/user.modal.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { getIO } from "../../sockets/index.js";

const CreateGroup = asynchandler(async (req, resp) => {
  const { name, description, members } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "name and description required");
  }

  const memberIds = Array.isArray(members) ? members : [];

  const group = await Group.create({
    name,
    description,
    members: [...new Set([req.user._id, ...memberIds])],
    admins: [req.user._id],
    createdBy:req.user._id
  });

  return resp
    .status(201)
    .json(new ApiResponse(201, group, "Group created successfully"));
});

const Getallgroups = asynchandler(async (req, resp) => {
  const groups = await Group.find({
    members: req.user._id,
  });
  if (!groups) {
    throw new ApiError(404, "NO groups found");
  }
  return resp
    .status(200)
    .json(new ApiResponse(200, groups, "All groups fetch successfully"));
});

const Addmembers = asynchandler(async (req, resp) => {
  const { groupId, userId } = req.body;
  if (!groupId || !userId) {
    throw new ApiError(404);
  }
  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(400, "Group does not exist");
  }
  const isadmin = group.admins.includes(req.user._id);
  if (!isadmin) {
    throw new ApiError(400, "only admin can add person");
  }

  const alreadyMember = group.members.includes(userId);

  if (alreadyMember) {
    throw new ApiError(400, "User already in group");
  }
  group.members.push(userId);
  await group.save();
  const io = getIO();
  io.to(groupId).emit("group-member-added", {
    groupId,
    userId,
    message: "New member joined group",
  });

  return resp
    .status(200)
    .json(new ApiResponse(200, group, "New members add succesfully"));
});

const removemembers = asynchandler(async (req, resp) => {
  const { groupId, userId } = req.body;
  if (!userId || !groupId) {
    throw new ApiError(400, "userId and groupId does not exist");
  }
  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(400, "group does not exist");
  }
  const isAdmin = group.admins.includes(req.user._id);

  if (!isAdmin) {
    throw new ApiError(403, "Only admin can remove members");
  }
  const member = group.members.includes(userId);
  if (!member) {
    throw new ApiError(400, "user does not include in this group");
  }
  group.members = group.members = group.members.filter(
  (item) => item.toString() !== userId
);
  await group.save();

  return resp
    .status(200)
    .json(new ApiResponse(200, group, "Member remove succesfully"));
});

export { CreateGroup, Getallgroups, Addmembers, removemembers};
