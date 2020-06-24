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
    ) public returns (int32) {
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

    function changePolicy(uint256 idx, bool permission) public returns (int32) {
        if (!(idx >= 0 && idx <= policyCount)) {
            return -1;
        }
        policies[idx].permission = permission;
        return 0;
    }

    function createActivityLog(
        string memory deviceId,
        string memory _activity,
        string memory requester,
        bool permission
    ) public returns (bool) {
        uint256 time = now;
        activityLogCount++;
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
}
