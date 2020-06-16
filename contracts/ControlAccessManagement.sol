pragma solidity >=0.4.21 <0.7.0;

contract ControlAccessManagement {
    uint256 public policyCount = 0;
    uint256 public activityLogCount = 0;
    string[2] activity = ["read", "write"];

    struct Policy {
        uint256 id;
        string deviceId;
        string activity;
        string requester;
        bool permission;
    }

    struct ActivityLog {
        uint256 id;
        uint256 time;
        string deviceId;
        string activity;
        string requester;
        bool permission;
    }

    constructor() public {
        addPolicy("", "", "", false);
        addActivityLog("", "", "");
    }

    mapping(uint256 => Policy) public policies;
    mapping(uint256 => ActivityLog) public activityLogs;

    event policyAdded(
        string deviceId,
        string activity,
        string requester,
        bool permission
    );

    event ActivityLogAdded(
        uint256 id,
        uint256 time,
        string deviceId,
        string activity,
        string requester,
        bool permission
    );

    function createPolicy(
        string memory _deviceId,
        string memory _activity,
        string memory _requester,
        bool permission
    ) public returns (uint256) {
        policyCount++;
        policies[policyCount] = Policy(
            policyCount,
            _deviceId,
            _activity,
            _requester,
            permission
        );
        emit policyAdded(_deviceId, _activity, _requester, permission);
        return 0;
    }

    function changePolicy(
        string memory deviceId,
        string memory _activity,
        string memory requester,
        bool permission
    ) public returns (int256) {
        int256 idx = getIndex(deviceId, _activity, requester);
        if (idx == -1) {
            return 1;
        }
        policies[uint256(idx)].permission = permission;
        return 0;
    }

    function getIndex(
        string memory deviceId,
        string memory _activity,
        string memory requester
    ) public view returns (int256) {
        for (uint256 i = 0; i < policyCount; i++) {
            Policy memory pls = policies[i];
            if (
                compareStrings(pls.deviceId, deviceId) &&
                compareStrings(pls.activity, _activity) &&
                compareStrings(pls.requester, requester)
            ) {
                return int256(i);
            }
        }
        return -1;
    }

    function createActivityLog(
        string memory deviceId,
        string memory _activity,
        string memory requester
    ) public returns (bool) {
        uint256 time = now;
        bool permission = false;
        activityLogCount++;
        for (uint256 i = 0; i < policyCount; i++) {
            Policy memory ply = policies[i];
            if (
                compareStrings(ply.deviceId, deviceId) &&
                compareStrings(ply.activity, _activity) &&
                compareStrings(ply.requester, requester)
            ) {
                permission = ply.permission;
                break;
            }
        }
        activityLogs[activityLogCount] = ActivityLog(
            activityLogCount,
            time,
            deviceId,
            _activity,
            requester,
            permission
        );
        emit ActivityLogAdded(
            activityLogCount,
            time,
            deviceId,
            _activity,
            requester,
            permission
        );
        return permission;
    }

    function compareStrings(string memory _a, string memory _b)
        private
        pure
        returns (bool)
    {
        return keccak256(abi.encode(_a)) == keccak256(abi.encode(_b));
    }
}
